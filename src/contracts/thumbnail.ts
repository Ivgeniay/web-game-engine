export type ThumbnailLoader = (id: string, signal: AbortSignal) => Promise<string>;
