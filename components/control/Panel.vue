<script lang="ts" setup>
import { AudioInfo, Music } from '~~/composables/states';

const playing = usePlayingSong()
const queue = useQueue()
const lastPlayed = useLastPlayed()
const volumeLevel = ref(1)
const progressPoint = ref(0)

const audio: Ref<HTMLAudioElement | null>  = ref(null)

function changeTime(point: number) {
  if (!audio.value || audio.value.duration === 0 || isNaN(audio.value.duration )) return
  const skipTo = point  * audio.value.duration 
  audio.value.currentTime = skipTo 
  progressPoint.value = point
}

async function togglePlay() {  
  if (!audio.value) return
  if (audio.value.paused) await audio.value.play()
  else await audio.value.pause()
}

async function skipBack() {  
  if (lastPlayed.value.length <= 1 || progressPoint.value > 0.05 ) 
    return changeTime(0)
  const last = lastPlayed.value.pop()!
  if (playing.value) queue.value.unshift(last)
  const music = lastPlayed.value.pop()!  
  if (Reflect.has(music, 'mediaUrl'))
    playing.value = music as AudioInfo
  else await playNow(music as Music)
}

async function skip() {
  const music = queue.value.shift()
  if (!music) {
    if (playing.value) lastPlayed.value.push(playing.value)
    return playing.value = null
  }
  if (Reflect.has(music, 'mediaUrl'))
    playing.value = music as AudioInfo
  else await playNow(music as Music)
}

async function changeVolume(level: number) {
  if (!audio.value) return
  audio.value.volume = level
  volumeLevel.value = level
  await saveConfig({ name: 'volume', value: level })
}

watch(() => playing.value?.mediaUrl, async (url) => {
  if (!audio.value) return
  audio.value.src = url ?? ''
  if (!url) return navigator.mediaSession.playbackState = 'none'
  await audio.value.play()
  lastPlayed.value.push(playing.value!)  
})

onBeforeMount(() => {
  fetchConfig('volume').then((config) => {
    if (config) volumeLevel.value = config.value
  })
})

onMounted(() => {
  const mediaSession = navigator.mediaSession
  audio.value!.addEventListener('canplay', () => {
    if (!audio.value) return
    if(!playing.value) 
      return console.warn('Song info is not available to set media session metadata');
    audio.value!.volume = volumeLevel.value
    const {album, artist, title, coverUrl } = playing.value
    const artwork: MediaImage[] | undefined = coverUrl ? [
      {
          src: coverUrl!,
      }
    ] : undefined
    mediaSession.metadata = new MediaMetadata({
      album, artist, title, artwork
    })
  })
  audio.value!.addEventListener('play', () => {
    mediaSession.playbackState = 'playing'
  })  
  audio.value!.addEventListener('pause', () => {
    mediaSession.playbackState = 'paused'
  })
  audio.value!.addEventListener('timeupdate', () => {
    if (!audio.value) return
    const { currentTime, duration } = audio.value
    progressPoint.value = currentTime / duration
  })
  audio.value!.addEventListener('ended', async () => {
    setTimeout(skip, 1000)
  })
  mediaSession.setActionHandler('nexttrack', skip)
  mediaSession.setActionHandler('previoustrack', skipBack)
  mediaSession.setActionHandler('play', togglePlay)
  mediaSession.setActionHandler('pause', togglePlay)
  window.addEventListener('keypress', (evt: KeyboardEvent) =>
    evt.code === 'Space' && togglePlay()
  )
  if (playing.value) audio.value!.src = playing.value.mediaUrl!
})
</script>

<template>
  <div>
    <audio ref="audio" />
    <Transition name="slide-down" mode="out-in">
      <div v-if="playing && !playing.loading" class="controls-container">
        <ControlProgress @change="changeTime" :point="progressPoint"/>
        <div class="bottom-controls">
          <ControlMedia :media="playing"/>
          <ControlAudio v-if="audio" :paused="audio.paused" 
            @toggle-play="togglePlay"
            @skip="skip"
            @skip-previuos="skipBack"/>
          <ControlVolume :level="volumeLevel"
            @change="changeVolume"
          />
        </div>
      </div>
      <div v-else-if="playing" class="controls-container">
        <div class="bottom-controls">
          <ControlMedia :media="playing"/>
        </div>
      </div>
      <div v-else-if="lastPlayed.length > 0" class="fixed bottom-4 w-full">
        <div class="mx-auto w-fit">
          <Button @click="skipBack">Play last song again</Button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.controls-container {
  @apply flex flex-col w-full h-20 fixed bottom-0 z-20 
  bg-slate-200 dark:bg-slate-800
}
.bottom-controls {
  @apply flex w-full h-full pb-1
}
.bottom-controls > * {
  @apply basis-1/3 px-4 py-2 overflow-x-hidden
}
</style>
