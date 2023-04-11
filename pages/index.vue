<template>
  <div class="page">
    <div class="logotipo">
      <img src="~/assets/img/logo_light.png">
    </div>
    <div class="presentation">
      <h2>Welcome to <span class="title">Play My Time</span> music player!</h2>
      <hr>
      <div v-if="itRuns">
        <span>
          This web application was created by me
          (<a class="text-link" href="https://pabloufrn.github.io">@pabloufrn</a>).
          Feel free to enjoy this music player and listen to your favorite playlists
          compiled in the m3u/m3u8 file format. There's a tutorial teaching how to
          generate these files in the playlists page. But remember, use only songs
          licensed for use. I don't support any type of piracy and I'm not 
          responsable for any misuse of this web app.
        </span>
        <div class="flex justify-end mt-4">
          <NuxtLink to="/ambiences" >
            <Button>Start playing your musics offline</Button>
          </NuxtLink>
        </div>
      </div>
      <div v-else>
        Unfortuly, this application is not supported at your current platform.
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { it } from 'node:test';

definePageMeta({
  layout: 'clean',
})
const itRuns = computed(() =>  window.showDirectoryPicker != undefined)
const colorMode = useColorMode()
</script>

<style scoped>
hr {
  @apply mt-4 mb-6 border-gray-100 dark:border-gray-900 border-opacity-30
}
.title {
  @apply text-violet-500
}
.logotipo {
  @apply flex justify-center
}
.logotipo img {
  @apply h-20
}
.presentation {
  @apply bg-gray-100 dark:bg-gray-900 
  bg-opacity-30 dark:bg-opacity-50
  mt-12 p-8 rounded-md 
}
</style>