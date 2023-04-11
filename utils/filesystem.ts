import { Parser } from "m3u8-parser"
import { parseBlob, selectCover } from 'music-metadata-browser'
import { AudioInfo } from "~~/composables/states"

let cachedRootDirHandle: FileSystemDirectoryHandle | null = null

async function getFileHandleByRelativePath(path: string) {
  const rootDirHandle = await getRootDirHandle()
  const [filename, ...dirsnames] = path.split('/').reverse()
  
  const fileDirHandle = await dirsnames.reverse().reduce(async (parentDirHandle, currentDirName) => {
    const handle = await parentDirHandle
    return handle.getDirectoryHandle(currentDirName)
  }, Promise.resolve(rootDirHandle))
  
  return await fileDirHandle.getFileHandle(filename)
}

async function getFileHandleByAbsolutePath(path: string) {
  const [filename] = path.split('/').reverse()
  return await getFileHandleByRelativePath(filename).catch(
    async () => await findFileHandleByAbsolutePath(path)
  )
}

async function findFileHandleByAbsolutePath(path: string)
  : Promise<FileSystemFileHandle> {
  const rootDirHandle = await getRootDirHandle()
  const [ filename, ...rdirs ] = path.split('/').reverse()
  const dirs = [...rdirs.reverse()]
  let index = -1
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i]
    const handle = await rootDirHandle.getDirectoryHandle(dir)
      .catch(() => null)
    if(handle) {
      index = i
      break
    }
  }
  if (index < 0) throw new Error('None of these directories were found inside root dir')
  const searchPath = dirs.slice(index).join('/') + '/' + filename
  return await getFileHandleByRelativePath(searchPath)
    .catch(async () => await findFileHandleByAbsolutePath(
      dirs.slice(index+1).join('/') + '/' + filename
    ))
}

export async function pick() {
  const options: DirectoryPickerOptions = {
    startIn: 'music',
    mode: 'read'
  }
  const rootDirHandle = await window.showDirectoryPicker(options).catch((e) => {
    if (e instanceof DOMException && e.name === 'AbortError') {
      return null
    }
    throw e
  })
  if (rootDirHandle) {
    await saveRootDirHandle(rootDirHandle)
    return true
  }  
  return false
}

export async function requestAccess() {
  const rootDirHandle = await getRootDirHandle()
  if (!rootDirHandle) return await pick()
  const permission = await rootDirHandle.requestPermission()
  return permission === 'granted'
}

export async function hasAccess() {
  const rootDirHandle = await getRootDirHandle()
  let permission = rootDirHandle && await rootDirHandle.queryPermission()
  return permission === 'granted'
}

async function getRootDirHandle(): Promise<FileSystemDirectoryHandle> {
  if (cachedRootDirHandle) return cachedRootDirHandle
  cachedRootDirHandle = (await fetchConfig('rootDirHandle'))?.value as FileSystemDirectoryHandle
  return cachedRootDirHandle
}

async function saveRootDirHandle(rootDirHandle: FileSystemDirectoryHandle) {
  await saveConfig({ name: 'rootDirHandle', value: rootDirHandle })
  cachedRootDirHandle = rootDirHandle
}

async function readPlaylists() {
  // Exceptions: NotAllowedError
  const rootDirHandle = await getRootDirHandle()
  const playlistsDirHandle = await rootDirHandle.getDirectoryHandle('playlists', {
    create: false,
  }).catch((e) => {
    if  (e instanceof DOMException && 
        (e.name === 'NotFoundError' || e.name === 'TypeMismatchError'))
      return rootDirHandle
    throw e
  })
  const playlists: { title: string, path: string }[] = []
  for await (const [name, handle] of playlistsDirHandle.entries()) {
    if (handle.kind === 'file') {      
      if (name.endsWith('m3u')  || name.endsWith('m3u8')) {
        const path = (await rootDirHandle.resolve(handle))!.join('/')
        playlists.push({ title: name.match(`(.+)\.m3u8?`)![1]!, path })
      }
    }
  }
  return playlists
}

async function readMusicsFromPlaylist(path: string) {
  const fileHandle = await getFileHandleByRelativePath(path)
  const file = await fileHandle.getFile()
  const manifest = await file.text()
  const parser = new Parser()
  parser.push(manifest)
  parser.end()
  const parsedManifest = parser.manifest
  return parsedManifest.segments.map((segment) => {
    const [filename] = decodeURIComponent(segment.uri).split('/').reverse()
    const title = /(.+?)(\.[^.]*$|$)/.exec(filename)![1]!
    return {
      uri: segment.uri,
      title
    }
  })
}

async function getFileByRelativePath(path: string) {
  const fileHandle = await getFileHandleByRelativePath(path)
  return await fileHandle.getFile()
}

async function getFileByAbsolutePath(path: string) {
  const fileHandle = await getFileHandleByAbsolutePath(path)
  return await fileHandle.getFile()
}

async function getFileByUrl(url: string) {
  const response = await fetch(url)
  const [ fileName ] = url.split('/').reverse()
  const blob = await response.blob()
  return new File([blob], fileName)
}

async function getAudioFile(uriOrPath: string) {
    const uriRegex = /(?:(\w+):\/\/)?([\d\w%;,\/?:@&=+$\-_.!~*'()#]+)/
    const [url, protocol, location] = uriRegex.exec(uriOrPath)!
    if (protocol == undefined)
      return await getFileByRelativePath(decodeURIComponent(location))
    if (protocol === 'file')
      return await getFileByAbsolutePath(decodeURIComponent(location))
    if (protocol.startsWith('http'))
      return await getFileByUrl(url)
    else
      throw createError({
         statusMessage: 'Protocol not supported',
         message: `This source of audio is not supported (url with from protocol ${protocol})`,
         statusCode: 400,
         fatal: false,
      })
}

async function readMusicDataFromURI(uriOrPath: string): Promise<AudioInfo> {
  const file = await getAudioFile(uriOrPath)
  const metadata = await parseBlob(file)

  const cover = selectCover(metadata.common.picture)

  const coverUrl = cover ? 
    `data:${cover.format};base64,${cover.data.toString('base64')}` 
    : undefined
  
  const title = metadata.common.title
  const artist = metadata.common.artist
  const album = metadata.common.album
  const mediaUrl = createObjectURL(uriOrPath, file)

  return {
    coverUrl,
    title,
    artist,
    album,
    mediaUrl,
    loading: false,
    uri: uriOrPath
  }
}

export async function fetchMusicDataFromURI(uri: string) {
  return await readMusicDataFromURI(uri).catch(e => {
    if (e instanceof DOMException) {
      if (e.name === 'NotFoundError' || e.name === 'TypeMismatchError') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Not found',
          message: `Music not found in path '${uri}'`,
        })
      } else if (e.name === 'NotAllowedError') {
        throw createError({
          statusCode: 403,
          statusMessage: 'Access forbidden',
          message: 'The application do not have permission to access the local file system.',
          fatal: true,
        })
      }
    } else if(isNuxtError(e)) {
      throw e
    }
    console.warn(e)
    throw createError({
      statusCode: 500,
      statusMessage: 'Music loading error',
      message: `Could not load music in path '${uri}'`,
    })
  })
}

export async function fetchPlaylistMusics(path: string) {
  return await readMusicsFromPlaylist(path).catch((e) => {
    if (e instanceof DOMException) {
      if (e.name === 'NotAllowedError') {
        throw createError({
          statusCode: 403,
          statusMessage: 'Access forbidden',
          message: 'The application do not have permission to access the local file system.',
          fatal: true,
        })
      } else if (e.name === 'NotFoundError') {
        throw createError({
          statusCode: 404,
          statusMessage: 'Playlist not found.',
          fatal: true,
        })
      }
    }
    console.error(e)
    throw createError({
      statusCode: 500,
      statusMessage: 'Playlist loading error',
      message: 'Could not load playlist file',
      fatal: true,
    })
  })
}

export async function fetchPlaylists() {
  return await readPlaylists().catch(() => {
    throw createError({
      statusCode: 500,
      statusMessage: 'Playlists loading error',
      message: 'Could not load playlists',
      fatal: true,
    })
  })
}
