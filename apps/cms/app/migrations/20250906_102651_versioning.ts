import { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-mongodb";

export async function up({ payload, req, session }: MigrateUpArgs): Promise<void> {
	await payload.update({
		collection: "posts",
		data: { _status: "published" },
		where: {},
	});
}

export async function down({ payload, req, session }: MigrateDownArgs): Promise<void> {
	await payload.update({
		collection: "posts",
		data: { _status: null },
		where: {},
	});
}
