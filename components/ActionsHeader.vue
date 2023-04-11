<script lang="ts" setup>
withDefaults(defineProps<{
  showLeft?: boolean,
  showRight?: boolean,
}>(), {
  showLeft: true,
  showRight: true,
})
</script>

<template>
  <div class="actions-header">
    <div v-show="showLeft">
      <slot name="left-actions"/>
    </div>
    <div v-show="showRight">
      <slot name="right-actions"/>
    </div>
  </div>
</template>

<style scoped>
.actions-header {
  @apply flex justify-between space-x-2 mb-2
}
.actions-header > div {
  @apply flex gap-2
}
</style>
