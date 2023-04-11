<script lang="ts" setup>
defineProps<{
  point: number,
}>()

const emit = defineEmits<{
  (e: 'change', point: number): void
}>()

const progressBar: Ref<HTMLDivElement | null> = ref(null)

function onChangeProgress(e: MouseEvent) {
  if (!progressBar.value) return
  const bar = progressBar.value
  const x = e.clientX - bar.getBoundingClientRect().left
  const point = x / bar.clientWidth
  emit('change', point)
}
</script>

<template>
  <div ref="progressBar" class="progress-bar" @click="onChangeProgress">
    <div ref="progressPoint" class="progress-point"
      :style="{
        width: 100*point+'%',
      }"
    ></div>
  </div>
</template>

<style scoped>
.progress-bar {
  @apply  cursor-pointer bg-slate-300 dark:bg-slate-700 
}

.progress-point {
  @apply h-2 w-0 bg-indigo-600 dark:bg-violet-600
    transition-all duration-300 ease-in-out
}

</style>
