import type { Track } from "./server/db/schema";

export function parseTracklist(value: string): Track[] {
	return value
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const match = /^(.*?)\s*[-–—|]?\s*(\d{1,2}(?::\d{2}){1,2})$/.exec(line);

			if (match?.[1]) {
				return { title: match[1], duration: match[2] };
			}

			return { title: line };
		});
}

export function formatTracklist(tracks: Track[]) {
	return tracks
		.map((track) => (track.duration ? `${track.title} ${track.duration}` : track.title))
		.join("\n");
}
