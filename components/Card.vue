<template>
<div class="card-container">
  <div class="card-content truncate notranslate">
    <slot/>
  </div>
  <Icon v-if="icon" class="card-icon" :name="icon"/>
</div>
</template>

<script lang="ts" setup>
defineProps<{ icon?: string }>()
</script>

<style scoped>
.card-container {
  @apply rounded-md p-2
    bg-indigo-400 hover:bg-indigo-300 
  dark:bg-slate-900 dark:hover:bg-slate-800
    cursor-pointer select-none flex shadow-md
}
.card-content {
  @apply flex items-center break-all truncate
}
.card-icon {
  @apply flex justify-end grow
}
</style>
