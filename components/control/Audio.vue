<script lang="ts" setup>
defineProps<{
  paused: boolean
}>()
defineEmits<{
  (e: 'skip'): void,
  (e: 'skipPreviuos'): void,
  (e: 'togglePlay'): void,
}>()
</script>
<template>
  <div class="controls">
    <Icon class="control-item" :size="36" name="skip_previous"
      @click="$emit('skipPreviuos')"/>
    <Icon class="control-item" :size="48"
      :name="paused ? 'play_circle': 'pause_circle'" 
      @click="$emit('togglePlay')"
    />
    <Icon class="control-item" :size="36" name="skip_next"
      @click="$emit('skip')"/>
  </div>
</template>

<style scoped>
.controls {
  @apply flex h-full justify-center items-center gap-4 min-w-fit
}
.control-item {
  @apply cursor-pointer text-indigo-500 hover:text-indigo-400 
  dark:text-slate-400 dark:hover:text-slate-500
}
</style>
