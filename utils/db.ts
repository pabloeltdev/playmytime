import Dexie, { Table } from 'dexie';

export interface PlaylistAmbience {
  uri: string,
  ambienceId: number,
  mode: string,
  order?: number
}

export interface Ambience {
  id?: number,
  name: string,
  icon: string,
  sorted: boolean,
  iconColors: [string, string],
  colors: [string, string],
}

export interface AppConfig {
  name: string,
  value: any,
}

export class PMTDexie extends Dexie {
  ambiences!: Table<Ambience>
  playlistsAmbience!: Table<PlaylistAmbience>  
  appConfigs!: Table<AppConfig>

  constructor() {
    super('PMTDatabase');
    this.version(1).stores({
      ambiences: '++id, name',
      playlistsAmbience: 'uri, ambienceId, order',
      appConfigs: 'name, value'
    });
  }
}

export const db = new PMTDexie();

export async function fetchConfig(name: string) {
  return db.appConfigs.get(name)
}
export async function saveConfig(config: AppConfig) {
  db.appConfigs.put(config)
}
export async function createAmbience() {
  const randomColor = () => "#000000".replace(/0/g, () => {
    return (~~(Math.random()*16)).toString(16);
  });

  const randomIcon = () => icons.at(
    Math.floor(Math.random()*icons.length)
  )!

  return await db.ambiences.add({
    name: 'New ambience',
    colors: [randomColor(), randomColor()],
    icon: randomIcon(),
    sorted: true,
    iconColors: ['#ffffff', '#ffffff']
  })
}

export async function saveAmbience(ambience: Ambience) {  
  await db.ambiences.put(ambience)
}

export async function deleteAmbience(ambienceId: number) {
  await db.ambiences.delete(ambienceId)
}

export async function fetchAllAmbiences() {
  return await db.ambiences.toArray()
}
export async function fetchAmbience(key: number) {
  if (typeof key !== 'number' || Number.isNaN(key)) return undefined
  return await db.ambiences.get(key)
}
export async function fetchAmbiencePlaylists(ambienceId: number) {
  return db.playlistsAmbience.where({ ambienceId }).sortBy('order')
}
export async function savePlaylistAmbience(playlistAmbience: PlaylistAmbience) {
  const { order } = playlistAmbience
  const table = db.playlistsAmbience
  if (order == null) throw 'Playlist without order (position in the sequence)'
  await db.transaction('rw', table, async () => {
    await table.where('order').aboveOrEqual(order)
      .each(async (item) => {
        await table.update(item.uri, { order: item.order!+1 })
      })
    await table.put(playlistAmbience)
  })
}
export async function removePlaylistAmbience(uri: string) {
  const table = db.playlistsAmbience
  await db.transaction('rw', table, async () => {
    const { order } = (await table.where({ uri }).first())!
    await table.delete(uri)
    await table.where('order').above(order)
      .each(async (item) => {
        await table.update(item.uri, { order: item.order!-1 })
      })
  })
}

async function reorder(from: number, to: number) {
  const table = db.playlistsAmbience
  if (from < to) {
    await table.where('order')
      .between(from, to, false, true).modify((item) => {
        item.order! -= 1
      })
  } else {
    await table.where('order')
      .between(to, from).modify((item) => {
        item.order! += 1
      })
  }
}

export async function movePlaylistAmbience(from: number, to: number) {
  if (from === to) return
  const table = db.playlistsAmbience
  const item = await table.where({ order: from }).first()
  if (!item) throw `Item (order: ${from} not found)`
  const { uri } = item
  await db.transaction('rw', table, async () => {
    await reorder(from, to)
    await table.update(uri, { order: to })
  })
}

