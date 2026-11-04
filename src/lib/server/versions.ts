import {
	and,
	desc,
	eq,
	getColumns,
	getTableName,
	sql,
	type InferInsertModel,
	type InferSelectModel,
	type SQL,
} from "drizzle-orm";
import type { PgColumn, PgTable } from "drizzle-orm/pg-core";

import { versions } from "./db/schema";

type Db = App.Locals["db"];
type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

export type Intent = "save" | "publish" | "unpublish";

interface Snapshot {
	content: string;
	[key: string]: unknown;
}

interface VersionedTable extends PgTable {
	id: PgColumn;
	status: PgColumn;
	content: PgColumn;
	publishedAt: PgColumn;
	updatedAt: PgColumn;
}

interface VersionedRow {
	id: number;
	status: "draft" | "published";
	content: string;
	publishedAt: Date | null;
}

function forEntity(table: PgTable, entityId: number | PgColumn) {
	return and(eq(versions.entityType, getTableName(table)), eq(versions.entityId, entityId));
}

async function recordVersion(
	tx: Tx,
	table: PgTable,
	entityId: number,
	{ content, ...metadata }: Snapshot,
	publishedAt: Date | null,
) {
	const [latest] = await tx
		.select({
			id: versions.id,
			version: versions.version,
			publishedAt: versions.publishedAt,
			unchanged: sql<boolean>`
				${versions.content} = ${content}
				AND ${versions.metadata} = ${JSON.stringify(metadata)}::jsonb
			`,
		})
		.from(versions)
		.where(forEntity(table, entityId))
		.orderBy(desc(versions.version))
		.limit(1);

	if (latest?.unchanged) {
		if (publishedAt && !latest.publishedAt) {
			await tx.update(versions).set({ publishedAt }).where(eq(versions.id, latest.id));
		}

		return;
	}

	await tx.insert(versions).values({
		entityType: getTableName(table),
		entityId,
		version: (latest?.version ?? 0) + 1,
		content,
		metadata,
		publishedAt,
	});
}

export async function findVersioned<T extends VersionedTable>(
	db: Db,
	table: T,
	where: SQL | undefined,
) {
	const latest = db
		.select()
		.from(versions)
		.where(forEntity(table, table.id))
		.orderBy(desc(versions.version))
		.limit(1)
		.as("latest");

	const [result] = await db
		.select({
			row: getColumns(table),
			latest: {
				version: latest.version,
				content: latest.content,
				metadata: latest.metadata,
				publishedAt: latest.publishedAt,
			},
		})
		.from(table as PgTable)
		.leftJoinLateral(latest, sql`true`)
		.where(where);

	if (!result) return undefined;

	const row = result.row as InferSelectModel<T> & VersionedRow;
	const version = result.latest;

	return {
		...row,
		...(version?.metadata as Partial<InferSelectModel<T>> | undefined),
		content: version?.content ?? row.content,
		version: version?.version ?? 0,
		pending: row.status === "published" && version !== null && !version.publishedAt,
	};
}

export function createVersioned<T extends VersionedTable>(
	db: Db,
	table: T,
	intent: Intent,
	values: Omit<InferInsertModel<T>, "status" | "publishedAt">,
	snapshot: Snapshot,
) {
	const publishedAt = intent === "publish" ? new Date() : null;

	return db.transaction(async (tx) => {
		const [{ id }] = (await tx
			.insert(table)
			.values({
				...values,
				status: publishedAt ? "published" : "draft",
				publishedAt,
			} as never)
			.returning({ id: table.id })) as { id: number }[];

		await recordVersion(tx, table, id, snapshot, publishedAt);

		return id;
	});
}

interface SaveVersionedContext {
	publish: boolean;
	existing: { publishedAt: Date | null };
	now: Date;
}

export function saveVersioned<T extends VersionedTable>(
	db: Db,
	table: T,
	id: number,
	intent: Intent,
	snapshot: Snapshot,
	live: (ctx: SaveVersionedContext) => Partial<InferInsertModel<T>>,
) {
	return db.transaction(async (tx) => {
		const [existing] = (await tx
			.select({ status: table.status, publishedAt: table.publishedAt })
			.from(table as PgTable)
			.where(eq(table.id, id))
			.for("update")) as [Pick<VersionedRow, "status" | "publishedAt">?];

		if (!existing) return false;

		const now = new Date();
		const publish = intent === "publish";

		let set: Record<string, unknown>;

		if (intent === "unpublish") {
			set = { status: "draft", updatedAt: now };
		} else if (intent === "save" && existing.status === "published") {
			set = { updatedAt: now };
		} else {
			set = {
				...live({ publish, existing, now }),
				status: publish ? "published" : "draft",
				publishedAt: publish ? (existing.publishedAt ?? now) : existing.publishedAt,
				updatedAt: now,
			};
		}

		await tx
			.update(table)
			.set(set as never)
			.where(eq(table.id, id));

		await recordVersion(tx, table, id, snapshot, publish ? now : null);

		return true;
	});
}

export function deleteVersions(db: Tx, table: PgTable, entityId: number) {
	return db.delete(versions).where(forEntity(table, entityId));
}
