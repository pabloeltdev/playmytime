<script lang="ts" setup>
async function onClick() {
  const router = useRouter()
  if(await pick()) await router.go(0)
}
</script>

<template>
  <Button type="secondary" @click="onClick">Re-pick directory</Button>
</template>

<style scoped></style>
