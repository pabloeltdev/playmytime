<script lang="ts" setup>
const alerts = useAlerts()
</script>

<template>
  <div class="alerts-container text-high-emp">
    <TransitionGroup name="fade">
      <div v-for="(alert, index) in alerts" 
        :key="index" class="alert">
        <div class="alert-content">{{ alert }}</div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.alerts-container {
  @apply fixed bottom-24 right-5 z-40 max-w-sm flex flex-col gap-2
}
.alert {
  @apply bg-indigo-500 dark:bg-violet-900 p-2 rounded-md cursor-not-allowed
}
.alert-content {
  @apply break-words select-none
}
</style>
