<template>
  <div>
    <h1>Playlists: </h1>
    <br>
    <div v-if="playlists.length === 0">
        <p>
          You need to have playlists in m3u/m3u8 format in order to
          reproduce them in this application. Download an example
          file and try it out!
        </p>
        <div class="empty-actions">
          <ButtonModal id="downloadExample">Show me how</ButtonModal>
          <ButtonRepick />
        </div>
      </div>
    <div v-else class="playlists">
      <div class="playlist-item" v-for="(playlist, index) in playlists" :key="index">
        <NuxtLink :to="`/playlists/${index+1}`">          
          <Card icon="music_note">
            <span>{{ playlist.title }}</span>
          </Card>
        </NuxtLink>
      </div>
    </div>
    <div v-if="playlists.length > 0" class="actions">
      <ButtonRepick/>
    </div>
    <ModalDownloadExample id="downloadExample"/>
  </div>
</template>


<script lang="ts" setup>
definePageMeta({
  middleware: ['permission']
})

const playlists = usePlaylists()

async function loadPlaylists() {
  try {
    playlists.value = await fetchPlaylists()
  } catch(e) {
    if(e instanceof DOMException && e.name === 'NotAllowedError') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access forbidden',
        message: 'The application do not have permission to access the local file system.',
        fatal: true,
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Playlists loading error',
      message: 'Could not load playlists from directory.',
      fatal: true,
    })
  }
}

onBeforeMount(async () => {
  await loadPlaylists()
})
</script>

<style scoped>
.playlists {
  @apply grid gap-2 grid-cols-2
}
.empty-actions {
  @apply flex gap-2 my-2
}
.actions {
  @apply flex w-full justify-end my-4
}
</style>