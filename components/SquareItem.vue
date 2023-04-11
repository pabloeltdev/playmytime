<template>
  <div class="square-container">
    <NuxtLink :to="to">
      <div :class="['square', { link: to }]" 
        :style="{
          background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]})` 
        }">
        <div class="square-overlay">
          <div class="w-full h-full flex justify-center items-center">
            <IconGradient class="flex" :name="icon" :colors="iconColors" :size="48"/>
          </div>
        </div>
      </div>
    </NuxtLink>
    <span v-if="title" class="item-title notranslate">
      {{ title }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { RouteLocationRaw } from 'vue-router';

defineProps<{
  title?: string,
  colors: [string, string],
  iconColors: [string, string],
  icon: string,
  to?: RouteLocationRaw,
}>()
</script>

<style scoped>
.square-container {
  @apply select-none;
}
.square {
  @apply aspect-square drop-shadow-md rounded-md
}
.square.link:hover {
  @apply border-2 border-gray-700 
}

.link .square-overlay {
  @apply hover:bg-white/25
}
.square-overlay {
  @apply bg-black/5 w-full h-full
}
.item-title {
  @apply flex justify-center
}
</style>
