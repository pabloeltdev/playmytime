<template>
  <div>
    <h1>Musics from playlist: </h1>
    <br>
    <MusicTable :musics="musics">
      <template #right-actions>
        <ButtonPlayAll :musics="musics"/>
      </template>
      <template #default="{ index }">
        <ButtonPlay type="action" :music="musics[index]" />
      </template>
      <template #no-musics>
        <span>This playlist is empty</span>
      </template>
    </MusicTable>
  </div>
</template>

<script lang="ts" setup>
import { Music } from '~~/composables/states';

definePageMeta({
  middleware: ['permission']
})
const route = useRoute()
const router = useRouter()

const playlistIndex = +route.params.id - 1

const musics = ref<Music[]>([])

const playlists = usePlaylists()

async function loadMusics() {
  const playlist = playlists.value.at(playlistIndex)
  if (playlist == null) return await router.push('/playlists')
  musics.value = await fetchPlaylistMusics(playlist.path)
}

onBeforeMount(async () => {
  await loadMusics()
})
</script>
<style scoped></style>