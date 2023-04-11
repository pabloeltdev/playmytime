import { Music } from "~~/composables/states"

const urls: [string, string][] = []

export function collectGarbage(ignored: string) {
  const queue = useQueue()
  const index = urls.findIndex((url_) => (
    url_[0] !== ignored && 
    queue.value.find((music) => music.uri === url_[0]) == undefined
  ))
  if (index < 0) return
  
  const [removed] = urls.splice(index, 1)
  // revoke object
  URL.revokeObjectURL(removed[1])
  // replace musics from queue
  queue.value.forEach(({ title, uri }, index) => {
    if (uri === removed[0])
      queue.value[index] = { title, uri } as Music
  })
  // replace musics from last played
  const lastPlayed = useLastPlayed()
  lastPlayed.value.forEach(({ title, uri }, index) => {
    if (uri === removed[0]) {
      lastPlayed.value[index] = { title, uri } as Music
    }
  })
}

export function createObjectURL(id: string, file: File) {
  const url = urls.find(([id_]) => id_ === id)
  if (url) return url[1]
  const newUrl = URL.createObjectURL(file)
  urls.push([id, newUrl])
  if (urls.length > 10) {
    collectGarbage(id)
  }
  return newUrl
}