<script lang="ts" setup>
import { SongQueue } from '~~/composables/states';

defineProps<{
  musics: SongQueue
}>()
</script>

<template>
  <div>
    <ActionsHeader :show-right="musics.length > 0">
      <template #left-actions>
        <slot name="left-actions"/>
      </template>
      <template #right-actions>
        <slot name="right-actions"/>
      </template>
    </ActionsHeader>
    <table v-show="musics.length > 0" class="musics-table">
      <thead>
        <tr>
          <td class="rounded-tl-md">Actions</td>
          <td class="rounded-tr-md">Title</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(music, index) in musics" :key="index">
          <td>
            <slot :index="index"/>
          </td>
          <td class="notranslate">
            {{ music.title }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-show="musics.length === 0">
      <slot name="no-musics"/>
    </div>
  </div>
</template>

<style scoped>
.musics-table {
  @apply w-full border-separate border-spacing-0
}
.musics-table th:first-child {
  @apply rounded-tl-md
}
.musics-table th:last-child {
  @apply rounded-tr-md
}
.musics-table tbody tr:last-child td:first-child {
  @apply rounded-bl-md
}
.musics-table tbody tr:last-child td:last-child {
  @apply rounded-br-md
}
.musics-table thead {
  @apply font-medium
}
.musics-table thead td {
  @apply border-b-2 border-slate-400 bg-slate-400
  dark:border-slate-700 dark:text-slate-400
  text-slate-200 dark:bg-slate-900 dark:bg-opacity-30
}
.musics-table tr {
  @apply border-b bg-slate-500 dark:bg-slate-800 
  odd:bg-opacity-20 even:bg-opacity-30
  dark:odd:bg-opacity-20 dark:even:bg-opacity-30
}
.musics-table td {
  @apply px-1 py-2
}

.musics-table td:first-child {
  @apply text-center w-40
}

.musics-table td:nth-child(2) {
  @apply truncate max-w-0
}
</style>
