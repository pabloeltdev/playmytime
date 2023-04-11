export interface Music {
  title: string,
  uri: string
}

export interface Playlist {
  title: string,
  path: string,
}

export interface AudioInfo {
  coverUrl?: string,
  album?: string,
  artist?: string,
  uri: string, 
  mediaUrl?: string,
  title?: string,
  loading: boolean,
}

export type SongQueue = (Music | AudioInfo)[]
// type LastQueue = AudioInfo[]

export const usePlayingSong = () => useState<AudioInfo | null>('playing', () => null)
export const useQueue = () => useState<SongQueue>('queue', () => [])
export const useLastPlayed = () => useState<SongQueue>('lastPlayed', () => [])
export const usePlaylists = () => useState<Playlist[]>('playlists', () => [])
