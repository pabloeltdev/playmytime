<script lang="ts" setup>
withDefaults(defineProps<{
  size?: 18 | 24 | 36 | 48,
  name: string,
}>(), {
  size: 24,
})
</script>

<template>
  <span :class="[
    'material-symbols', 'notranslate', 
    'select-none', 'md-'+size
    ]">
    {{ name }}
  </span>
</template>

<style scoped>
</style>
