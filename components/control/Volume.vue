<script lang="ts" setup>
const props = defineProps<{
  level: number,
}>()
const emit = defineEmits<{
  (e: 'change', factor: number): void
}>()

const muted = computed(() => props.level === 0)
const icon = computed(() => (
  props.level === 0 ? 'volume_off' : (
    props.level < 0.2 ? 'volume_mute' : (
      props.level < 0.4 ? 'volume_down' : 'volume_up'
    )
  )
))
const volumeBarArea = ref<HTMLDivElement | null>(null)

let mouseDown = false
let previousLevel = props.level

function onChange(e: MouseEvent) {
  if (!volumeBarArea.value) return
  const x = e.clientX - volumeBarArea.value.getBoundingClientRect().left
  const width = volumeBarArea.value.clientWidth
  const level = x <= 0 ? 0 : ( x > width ? 1 : (x / width))
  emit('change', level)
}
function onMouseDown() {
  mouseDown = true
}
function onMouseUp() {
  mouseDown = false
}
function onMouseMove(e: MouseEvent) {
  if (mouseDown) onChange(e)
}
function toggleMute() {
  if (muted.value) return emit('change', previousLevel)
  previousLevel = props.level
  emit('change', 0)
}
</script>

<template>
  <div class="volume-control">
    <Icon class="volume-icon" :name="icon"
      @click="toggleMute"
    />
    <div ref="volumeBarArea" class="volume-bar-area" 
      @click="onChange"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @mousemove="onMouseMove"
      @mouseleave="onMouseUp"
      >
      <div class="volume-bar">
        <div class="volume-level"
          :style="{
            width: 100*level+'%'
          }"
        />
        <div class="slider-circle"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.volume-control { 
  @apply flex gap-2 items-center justify-end h-full min-w-fit
}
.volume-icon {
  @apply cursor-pointer hover:text-slate-500
}
.volume-bar-area {
  @apply flex items-center h-6
}
.volume-bar {
  @apply flex items-center h-1 w-20 rounded-md 
  bg-slate-400 dark:bg-slate-700
}
.volume-level {
  @apply h-full w-10 rounded-md bg-indigo-400 dark:bg-violet-500
}
.slider-circle {
  @apply hidden w-3 h-3 -m-1.5 rounded-full bg-indigo-400 dark:bg-violet-500
}
.volume-bar-area:hover .slider-circle {
  @apply flex
}
</style>
