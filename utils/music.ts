import { Music } from "~~/composables/states"

const playing = usePlayingSong()
const queue = useQueue()
let loading = false

export async function playNow(music: Music) {
  if (loading) return
  loading = true
  playing.value = {
    loading: true,
    uri: music.uri
  }
  fetchData(music).then((data) => {
    playing.value = data
    loading = false
  }).catch(() => {
    playing.value = null
    loading = false
  })
}

export async function playNowOrNext(music: Music) {
  if (playing.value) {
    const { $notify } = useNuxtApp()
    $notify('Music added to start of the queue')
    return queue.value.unshift(music)
  }
  await playNow(music)
}

async function fetchData({ title, uri }: Music) {
  const data = await fetchMusicDataFromURI(uri).catch((e) => {
    if (isNuxtError(e) && !e.fatal){
      const { $notify } = useNuxtApp()
      $notify(e.message ?? `Could not load music in '${uri}'`)      
    }
    throw e
  })
  if (!data.title) data.title = title
  return data
}