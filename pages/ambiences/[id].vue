<script lang="ts" setup>
import { Music } from '~~/composables/states';
import { Ambience, PlaylistAmbience } from '~~/utils/db';

definePageMeta({
  middleware: ['permission'],
})

const { $notify } = useNuxtApp()
const route = useRoute()
const ambienceId = +route.params.id

const musics = ref<Music[]>([])
const ambience = ref<Ambience | null>(null)

const ambiencePlaylists = ref<PlaylistAmbience[]>([])
const notInAmbiencePlaylists = ref<PlaylistAmbience[]>([])
const notFoundUris = ref<string[]>([])

async function loadAmbience() {
  const ambienceResult = await fetchAmbience(ambienceId).catch(() => undefined)
  if (ambienceResult == undefined)
    throw createError({
      message: 'Ambience does not exist',
      statusCode: 404,
      statusMessage: 'Not found',
      fatal: true,
    })
  ambience.value = ambienceResult
}

async function loadAmbiencePlaylists() {
  ambiencePlaylists.value = await fetchAmbiencePlaylists(ambienceId)
}

async function loadAllPlaylists() {
  try {
    const loadedPlaylists = await fetchPlaylists()
    notInAmbiencePlaylists.value = loadedPlaylists.map(({ path }) => (
      {
        uri: path,
        mode: 'random',
        ambienceId,
      }
    )).filter((playlist) => (
      !ambiencePlaylists.value.find(({ uri }) => uri === playlist.uri)
    ))
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

async function loadMusics() {
  const playlists = ambience.value?.sorted ? 
    ambiencePlaylists.value : shuffle(ambiencePlaylists.value) 
  musics.value = await playlists.reduce(async (prev, curr) => {
    let musics: Music[] = await fetchPlaylistMusics(curr.uri).catch((e: Error) => {
      if (!isNuxtError(e) || e.statusCode !== 404) throw e
      $notify(`Playlist not found in path '${curr.uri}'`)
      notFoundUris.value.push(curr.uri)
      return []
    })
    if (curr.mode === 'random') musics = shuffle(musics)
    return [...(await prev), ...musics]
  }, Promise.resolve<Music[]>([]))
}

function shuffle<T>(array: T[]) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

async function save() {
  if (ambience) await saveAmbience(JSON.parse(JSON.stringify(ambience.value)))
}

async function onUpdateSort(sort: boolean) {
  if(!ambience.value) return
  ambience.value.sorted = sort
  await saveAmbience(JSON.parse(JSON.stringify(ambience.value)))
}

onBeforeMount(async () => {
  await loadAmbience()
  await loadAmbiencePlaylists()
  await loadAllPlaylists()
  await loadMusics()
})
</script>

<template>
  <div>
    <div class="flex gap-2 items-center">
      <SquareItem v-if="ambience" class="square" 
          :colors="ambience.colors"
          :icon="ambience.icon"
          :icon-colors="ambience.iconColors"/>
      <h1 class="notranslate">{{ ambience?.name || 'Ambience' }}</h1>
    </div>
    <br>
    <MusicTable :musics="musics">
      <template #left-actions>
        <ButtonModal type="secondary" id="managePlaylists">Manage playlists</ButtonModal>
        <ButtonModal type="secondary" id="editAmbience">Edit Ambience</ButtonModal>
      </template>
      <template #right-actions>
        <Button type="secondary" @click="loadMusics">Reshuffle</Button>
        <ButtonPlayAll :musics="musics" :autoplay="true" />
      </template>
      <template #default="{ index }">
        <ButtonPlay type="action" :music="musics[index]" />
      </template>
      <template #no-musics>
        <span v-if="
          notFoundUris.length === 0 &&
          notInAmbiencePlaylists.length === 0
        ">
          You have no playlists. Check the 
          <NuxtLink class="text-link" to="/playlists">Playlists page</NuxtLink>.
        </span>
        <span
          v-else-if="
            ambiencePlaylists.length - notFoundUris.length === 0
          ">
          You have not added any playlist to this ambience.
        </span>
      </template>
    </MusicTable>
    <ModalManagePlaylists v-if="ambience" id="managePlaylists"
      :ambience-playlists="ambiencePlaylists"
      :not-in-ambience-playlists="notInAmbiencePlaylists"
      @change="loadMusics" :not-found-uris="notFoundUris" 
      :sort="ambience.sorted" @update:sort="onUpdateSort"
    />
    <ModalEditAmbience v-if="ambience" :ambience="ambience"
      id="editAmbience" @change="save"
    />
  </div>
</template>

<style scoped></style>
