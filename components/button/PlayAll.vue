<script lang="ts" setup>
import { Music } from '~~/composables/states';

const props = defineProps({
  musics: {
    type: Array<Music>,
    required: true
  },
  autoplay: {
    type: Boolean,
    default: false,
  }
})

const { $notify } = useNuxtApp()

const playing = usePlayingSong()
const queue = useQueue()
let playOnUpdate = false

async function playAll() {
  if (props.musics.length === 0) return
  queue.value = [...props.musics]
  const music = queue.value.shift() as Music
  await playNow(music)
}

function autoplay() {
  if (props.autoplay && !playing.value && queue.value.length === 0) playAll()
}

onMounted(() => {
  if (props.autoplay && props.musics.length === 0) playOnUpdate = true
  else autoplay()
})
onUpdated(() => {
  if (!playOnUpdate) return
  playOnUpdate = false
  autoplay()
})
</script>

<template>
  <div>
    <Button @click="playAll">
      Play all
    </Button>
  </div>
</template>

<style scoped></style>
