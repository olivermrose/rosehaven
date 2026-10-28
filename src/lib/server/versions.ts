import { and, desc, eq, getTableName, sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

import { versions } from "./db/schema";

type Executor = Pick<App.Locals["db"], "select" | "insert" | "delete">;

interface Snapshot {
	content: string;
	[key: string]: unknown;
}

interface Versioned {
	id: number;
	status: "draft" | "published";
	content: string;
}

function forEntity(table: PgTable, entityId: number) {
	return and(eq(versions.entityType, getTableName(table)), eq(versions.entityId, entityId));
}

export function createVersion(
	db: Executor,
	table: PgTable,
	entityId: number,
	snapshot: Snapshot,
	publishedAt: Date | null = null,
) {
	const { content, ...metadata } = snapshot;

	const next = db
		.select({ version: sql`coalesce(max(${versions.version}), 0) + 1` })
		.from(versions)
		.where(forEntity(table, entityId));

	return db.insert(versions).values({
		entityType: getTableName(table),
		entityId,
		version: sql`(${next})`,
		content,
		metadata,
		publishedAt,
	});
}

export async function withLatestVersion<T extends Versioned>(db: Executor, table: PgTable, row: T) {
	const [latest] = await db
		.select()
		.from(versions)
		.where(forEntity(table, row.id))
		.orderBy(desc(versions.version))
		.limit(1);

	return {
		...row,
		...(latest?.metadata as Partial<T> | undefined),
		content: latest?.content ?? row.content,
		version: latest?.version ?? 0,
		pending: row.status === "published" && latest !== undefined && !latest.publishedAt,
	};
}

export function deleteVersions(db: Executor, table: PgTable, entityId: number) {
	return db.delete(versions).where(forEntity(table, entityId));
}
