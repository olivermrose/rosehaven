import type { Track } from "./server/db/schema";

export const RATING_MAX = 10;

export function normalizeTracklist(tracks: Track[]): Track[] {
	return tracks
		.map((track) => ({
			title: track.title.trim(),
			duration: track.duration?.trim() || undefined,
			rating: track.rating,
		}))
		.filter((track) => track.title);
}
