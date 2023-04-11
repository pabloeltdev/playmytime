<template>
  <Transition name="fade">
    <div v-show="showModal" class="modal" @click="onClose">
      <div class="modal-window-container">
        <div class="modal-window" @click="onClickInside">
          <div class="modal-title">
            <div class="flex items-center justify-between">
              <span v-if="title" class="text-high-emp">{{ title }}: </span>
              <span v-else/>
              <Button type="secondary" @click="onClose">Close</Button>
            </div>
            <hr>
          </div>
          <slot/>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title?: string,
  id: string,
}>()
const emit = defineEmits(['close'])

const { showModal, toggleModal } = useModal(props.id)

function onClose(e: Event) {
  toggleModal()
  emit('close')
}

function onClickInside(e: Event) {
  e.stopPropagation()
}
</script>

<style scoped>
.modal {
  @apply fixed top-0 left-0 h-screen
    w-screen bg-black/90 z-30
}
.modal-window-container {
  @apply h-screen w-full flex items-center justify-center
    px-14 py-8 md:px-24 lg:px-40
}
.modal-window {
  @apply fixed overflow-y-auto min-w-fit max-h-full p-4
  bg-slate-50 dark:bg-slate-900 rounded-md
}
.modal-title > hr {
  @apply mt-2 mb-4 border-slate-300 dark:border-slate-800
}

.modal-window::-webkit-scrollbar {
  @apply w-2
}
.modal-window::-webkit-scrollbar-track {
  @apply bg-slate-700 bg-opacity-50
}
.modal-window::-webkit-scrollbar-thumb {
  @apply bg-slate-900 bg-opacity-75
}
</style>