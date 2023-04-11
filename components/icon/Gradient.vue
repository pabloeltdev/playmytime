<script lang="ts" setup>
withDefaults(defineProps<{
  size?: 18 | 24 | 36 | 48,
  name: string,
  colors: [string, string]
}>(), {
  size: 24,
})
</script>

<template>
  <div class="no-translate">
    <span
      :class="['material-symbols', 'notranslate', 'md-'+size]"
      :style="{
        background: 
          `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`,
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
      }"
    >
      {{ name }}
    </span>
  </div>
</template>

<style scoped></style>
