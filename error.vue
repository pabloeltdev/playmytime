<template>
  <div class="container">
    <div class="page">
      <span class="code">{{ error.statusCode }}</span>
      <h1>{{ error.statusMessage }}</h1>
      <Button class="mt-6" @click="handleError">Back to home</Button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { NuxtError } from '#app';

defineProps<{
  error: NuxtError
}>()
const router = useRouter()
const handleError = () => router.push('/')
</script>
<style scoped>
.container {
  @apply py-20
}
.page {
  @apply flex flex-col items-center gap-2
}
.code {
  @apply text-9xl
}
</style>