<script lang="ts" setup>
import { AudioInfo } from '~~/composables/states';

defineProps<{
  media: AudioInfo
}>()
</script>

<template>
  <div class="media">
    <img class="cover" v-if="media.coverUrl" :src="media.coverUrl"/>
    <div v-else-if="media.loading" class="loading cover"></div>
    <div class="info notranslate">
      <span v-if="!media.loading" class="title text-high-emp">{{ media.title }}</span>
      <span v-else class="loading title text-high-emp">Loading...</span>
      <br>
      <span v-if="media.artist" class="album text-sm">{{ media.artist }}</span>
      <span v-if="media.album" class="album text-sm"> &centerdot; </span>
      <span v-if="media.album" class="album text-sm">{{ media.album }}</span>
    </div>
  </div>
</template>

<style scoped>
.media {
  @apply flex gap-x-2
}
.info {
  @apply truncate
}
.cover {
  @apply h-full rounded-md border-2 
border-slate-400 
}
.loading {
  @apply animate-pulse
}
.loading.cover {
  @apply bg-slate-700 aspect-square
}
</style>
