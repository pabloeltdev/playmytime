<script lang="ts" setup>
defineProps<{
  id: string,
}>()
</script>

<template>
  <Modal :id="id" title="Try out the player">
    <div class="flex flex-col justify-center max-w-md">
      <p class="text-justify my-2">
        The following playlist was created with musics obtained from
        <NuxtLink class="text-link" to="https://pixabay.com/music">Pixabay</NuxtLink>. 
        Use this playlist only for testing by the first time this music player.
      </p>
      <b>How to use the playlist: </b>
      <ul>
        <li>1 - Download the file</li>
        <li>2 - Extract the content to the folder you
          selected earlier.
        </li>
        <li>3 - Refresh this page and enjoy!</li>
      </ul>
      <p class="note">Check my 
        <NuxtLink class="text-link" to="/tutorial">Tutorial</NuxtLink> and learn
        how to create your own playlist
      </p>
      <Button>
        <a href="/playlists/playlist.m3u" download>Download playlist</a>
      </Button>
    </div>
  </Modal>
</template>

<style scoped>
.note {
  @apply text-justify my-4 p-2 rounded-md
  bg-slate-300 dark:bg-slate-800 
}
</style>
