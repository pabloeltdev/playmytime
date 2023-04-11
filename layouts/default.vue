<template>
  <div>
    <div class="layout-container mb-20">
      <div class="pl-12 md:pl-0">
        <slot />
      </div>
    </div>
    <ControlPanel/>
    <Sidebar />
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped></style>