<template>
  <div class="layout-background">
    <div class="background-overlay">
      <div class="layout layout-container">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const playing = usePlayingSong()
playing.value = null
</script>

<style scoped>
.background-overlay {
  @apply bg-white dark:bg-black bg-opacity-10 dark:bg-opacity-70
  w-full h-full min-h-screen
}
.layout-background {
  background-image: url(~/assets/img/background.png);
  @apply min-h-screen bg-no-repeat bg-cover
}
</style>


