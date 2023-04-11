<script lang="ts" setup>
import { PlaylistAmbience } from '~~/utils/db';

const props = defineProps<{
  ambiencePlaylists: PlaylistAmbience[],
  notInAmbiencePlaylists: PlaylistAmbience[],
  notFoundUris: string[],
  sort: boolean,
  id: string,
}>()
const emit = defineEmits<{
  (e: 'update:sort', value: boolean): void,
  (e: 'cancel'): void,
  (e: 'change'): void,
}>()

const { $notify } = useNuxtApp()

let error = false
let removed = false

let notFoundAmbiencePlaylists = computed(
  () => props.ambiencePlaylists.map(
    ({ uri }) => props.notFoundUris.find((uri_) => uri_ === uri) != undefined 
  )
)

async function removePlaylist(index: number) {
  if (removed) return
  const { uri } = props.ambiencePlaylists[index]
  try {
    await removePlaylistAmbience(uri)
    props.ambiencePlaylists.splice(index, 1)
    const notFoundIndex = props.notFoundUris.findIndex((uri_) => uri_ === uri)
    props.notFoundUris.splice(notFoundIndex, 1)
    $notify('Playlist removed.')
    removed = true
    setTimeout(() => removed = false, 200)
  } catch(e) {
    $notify('Internal error while removing the playlist. Reload the page and try again.')
    console.error(e);
  }
}
async function toggleSort(e: Event) {
  e.preventDefault()
  const target = e.target as HTMLInputElement
  emit('update:sort', target.value === 'yes')
}
async function toggleRandom(index: number) {
  const playlist = props.ambiencePlaylists[index]
  if (!playlist) return
  playlist.mode = playlist.mode === 'random' ? 'ordered': 'random' 
  await savePlaylistAmbience({ ...playlist })
  emit('change')
}
function onError(e: Error) {
  error = true
  console.error(e);
  $notify('Could not change playlists order due to an internal error. \
    Reload the page and try again.')
}
async function onChange({ added, moved, removed }: Record<string, any>) {
  if (error) return
  if (added && added.element)
    await savePlaylistAmbience({ 
      ...added.element, 
      order: added.newIndex, 
    }).catch(onError)
  else if (removed && removed.element)
    await removePlaylistAmbience(removed.element.uri).catch(onError)
  else if (moved && moved.element)
    await movePlaylistAmbience(moved.oldIndex, moved.newIndex).catch(onError)
  emit('change')
}
</script>

<template>
  <Modal title="Manage playlists of ambience"
    :id="id" @cancel="emit('cancel')">
    <div>
      <div v-if="
        (ambiencePlaylists.length - notFoundUris.length) +
        (notInAmbiencePlaylists.length) === 0" class="not-found-note"
      >
        <p class="inline">Note: you don't have any valid playlist: </p>
        <ButtonRepick />
      </div>

      <p v-if="notFoundUris.length > 0" class="not-found-note">
        Note: Some playlists files were not found in your system.
        Use the 'delete' icon in order to remove them.
      </p>
      <div class="sorted-toggle">
        <span>Sort playlists order (random order otherwise)?</span>
        <div class="sorted-radio">
          <div>
            <input type="radio" name="sorted" id="sorted_yes"
              value="yes" :checked="sort"
              @input="toggleSort"/>
            <label for="sorted_yes">Yes</label>
          </div>
          <div>
            <input type="radio" name="sorted" id="sorted_no"
              value="no" :checked="!sort"
              @input="toggleSort"/>
            <label for="sorted_no">No</label>
          </div>
        </div>
      </div>
      <div class="manage-playlists">
        <div class="manage-playlists-panel">
          <span>Playlists in ambience: </span>
          <div class="manage-playlists-list">
            <Draggable
              :list="ambiencePlaylists"
              :animation="300"
              :sort="sort"
              group="playlists"
              ghostClass="manage-playlists-ghost-item"
              class="drag-area"
              @change="onChange"
            >
              <div
                :class="['manage-playlists-item', { 
                  'not-found': notFoundAmbiencePlaylists[index],
                }]" 
                v-for="(playlist, index) in ambiencePlaylists" :key="index">
                <span class="notranslate">
                  {{ decodeURI(playlist.uri).match(`//?(.+)\.m3u8?`)![1]! }}
                </span>
                <div class="manage-playlists-action-container">
                  <div
                    v-if="notFoundAmbiencePlaylists[index]" 
                    class="manage-playlists-action"
                    @click="removePlaylist(index)">
                    <Icon name="delete"/>
                  </div>
                  <div v-else 
                    class="manage-playlists-action" 
                    @click="toggleRandom(index)">
                    <Icon :name="playlist.mode === 'random' ? 'shuffle_on' : 'shuffle'"/>
                  </div>
                </div>
              </div>
            </Draggable>
          </div>
        </div>
        <div class="manage-playlists-panel">
          <span>Other playlists: </span>
          <div class="manage-playlists-list">
            <Draggable
              :list="notInAmbiencePlaylists"
              :sort="false"
              :animation="0"
              group="playlists"
              class="drag-area"
              ghostClass="manage-playlists-ghost-item"
            >
              <div class="manage-playlists-item" 
                v-for="(playlist, index) in notInAmbiencePlaylists" 
                :key="index">
                <span class="notranslate">
                  {{ decodeURI(playlist.uri).match(`//?(.+)\.m3u8?`)![1]! }}
                </span>
              </div>
            </Draggable>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.sorted-toggle {
  @apply flex gap-4 my-1
}
.sorted-radio {
  @apply flex gap-3
}
.sorted-radio > * {
  @apply flex gap-2 items-center
}
.not-found-note {
  @apply bg-slate-400 dark:bg-slate-800 my-4 p-2 rounded-md
}
.manage-playlists {
  min-width: 75vw;
  @apply flex gap-2
}
.manage-playlists-panel {
  @apply w-1/2
}
.manage-playlists-list {
  -ms-overflow-style: none;
  scrollbar-width: none;
  @apply overflow-y-scroll mt-2 pr-1 select-none
}
.manage-playlists-list::-webkit-scrollbar {
  @apply w-1
}
.manage-playlists-list::-webkit-scrollbar-track {
  @apply bg-slate-200 dark:bg-slate-700 dark:bg-opacity-50
}
.manage-playlists-list::-webkit-scrollbar-thumb {
  @apply bg-slate-400 dark:bg-slate-900 dark:bg-opacity-75
}
.drag-area {
  @apply flex flex-col gap-2 h-64 overscroll-contain rounded-md
    bg-slate-200 dark:bg-slate-800 dark:bg-opacity-25 
}
.manage-playlists-item {
  -webkit-user-drag: element;
  @apply flex items-center gap-2 px-2 py-2
  bg-indigo-300 dark:bg-slate-700  dark:bg-opacity-75 cursor-move
    shadow-md rounded-md
}
.manage-playlists-item.not-found {
  -webkit-user-drag: none;
  @apply bg-red-400 dark:bg-red-800 cursor-not-allowed
}
.manage-playlists-item span {
  @apply truncate
}
.manage-playlists-action-container {
  @apply flex flex-row-reverse grow
}
.manage-playlists-ghost-item {
  @apply bg-indigo-400 dark:bg-slate-600
}
.manage-playlists-ghost-item .manage-playlists-action-container {
  @apply hidden
}
.manage-playlists-action {
  @apply inline-flex cursor-pointer hover:text-slate-500
}
</style>
