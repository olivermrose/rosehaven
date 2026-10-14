import { artworkAt } from "#lib";
import type { Track } from "./db/schema";

const API = "https://itunes.apple.com";
const ARTWORK_SIZE = 600;

interface ItunesCollection {
	wrapperType: "collection";
	collectionId: number;
	collectionName: string;
	artistName: string;
	artworkUrl100: string;
	releaseDate: string;
	trackCount: number;
}

interface ItunesTrack {
	wrapperType: "track";
	kind: string;
	trackName: string;
	trackNumber: number;
	discNumber: number;
	trackTimeMillis?: number;
}

export interface AlbumSummary {
	id: number;
	title: string;
	artist: string;
	year: number;
	thumbnail: string;
	trackCount: number;
}

export interface Album {
	title: string;
	artist: string;
	year: number;
	artwork: string;
	tracklist: Track[];
}

async function request<T>(path: string, params: Record<string, string>) {
	const url = new URL(path, API);
	url.search = new URLSearchParams(params).toString();

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`iTunes ${path} failed with ${response.status}`);
	}

	const { results } = (await response.json()) as { results: T[] };
	return results;
}

function formatDuration(ms: number) {
	const seconds = Math.round(ms / 1000);
	return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export async function searchAlbums(term: string, country = "us"): Promise<AlbumSummary[]> {
	const results = await request<ItunesCollection>("/search", {
		term,
		country,
		media: "music",
		entity: "album",
		limit: "8",
	});

	return results.map((album) => ({
		id: album.collectionId,
		title: album.collectionName,
		artist: album.artistName,
		year: new Date(album.releaseDate).getUTCFullYear(),
		thumbnail: album.artworkUrl100,
		trackCount: album.trackCount,
	}));
}

export async function lookupAlbum(id: number, country = "us"): Promise<Album | null> {
	const results = await request<ItunesCollection | ItunesTrack>("/lookup", {
		id: String(id),
		country,
		entity: "song",
	});

	const album = results.find((r): r is ItunesCollection => r.wrapperType === "collection");
	if (!album) return null;

	const tracklist = results
		.filter((r): r is ItunesTrack => r.wrapperType === "track" && r.kind === "song")
		.toSorted((a, b) => a.discNumber - b.discNumber || a.trackNumber - b.trackNumber)
		.map((track) => ({
			title: track.trackName,
			duration: track.trackTimeMillis ? formatDuration(track.trackTimeMillis) : undefined,
		}));

	return {
		title: album.collectionName,
		artist: album.artistName,
		year: new Date(album.releaseDate).getUTCFullYear(),
		artwork: artworkAt(album.artworkUrl100, ARTWORK_SIZE),
		tracklist,
	};
}
