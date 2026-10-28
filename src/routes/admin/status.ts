export type Status = "draft" | "published";
export type StatusFilter = "all" | Status | "pending";

interface Entry {
	status: Status;
	pending: boolean;
}

export function matchesStatus(entry: Entry, filter: StatusFilter) {
	if (filter === "all") return true;
	if (filter === "pending") return entry.pending;

	return entry.status === filter;
}

export function statusFilters(entries: Entry[]) {
	const count = (filter: StatusFilter) =>
		entries.filter((entry) => matchesStatus(entry, filter)).length;

	return [
		{ value: "all", label: "All", count: count("all") },
		{ value: "published", label: "Published", count: count("published") },
		{ value: "draft", label: "Drafts", count: count("draft") },
		{ value: "pending", label: "Pending", count: count("pending") },
	] satisfies { value: StatusFilter; label: string; count: number }[];
}

export function summarize(entries: Entry[], noun: string) {
	const drafts = entries.filter((entry) => entry.status === "draft").length;
	const pending = entries.filter((entry) => entry.pending).length;

	return [
		`${entries.length} ${entries.length === 1 ? noun : `${noun}s`}`,
		drafts && `${drafts} ${drafts === 1 ? "draft" : "drafts"}`,
		pending && `${pending} with unpublished changes`,
	]
		.filter(Boolean)
		.join(" · ");
}
