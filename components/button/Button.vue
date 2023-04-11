<template>
  <button :class="['btn', type, 
    { 'text-light': type === 'primary' },
    { 'text-high-emp': type === 'primary' && colorMode.value === 'light'}]">
    <slot />
  </button>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  type?: 'primary' | 'secondary' | 'action',
}>(), {
  type: 'primary',
})
const colorMode = useColorMode()
</script>

<style scoped>
.btn {
  @apply rounded-md px-2 py-1 select-none whitespace-nowrap
    shadow-md
}
.btn.primary {
  @apply bg-indigo-500 hover:bg-indigo-400 dark:bg-violet-900 dark:hover:bg-violet-800
}
.btn.btn.action {
  @apply bg-transparent border-2
    border-indigo-500 hover:bg-indigo-500 hover:text-slate-300
   dark:border-violet-900 dark:hover:bg-violet-900
}
.btn.secondary {
  @apply border border-indigo-500 dark:border-slate-500
  hover:bg-indigo-500 hover:text-slate-300
    dark:hover:bg-slate-700 dark:hover:border-slate-200
}
</style>
