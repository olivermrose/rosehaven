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
