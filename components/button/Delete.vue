<script lang="ts" setup>
const pedingConfirmation = ref(false)
const emit = defineEmits(['delete'])
let timeout: NodeJS.Timeout | null = null
let clicked = false

function onClick() {
  if (clicked) return
  if (pedingConfirmation.value) return emit('delete')
  pedingConfirmation.value = true
  clicked = true
  setTimeout(() => {
    clicked = false
  }, 200)
  timeout = setTimeout(() => {
    pedingConfirmation.value = false
  }, 2000)
}

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})

</script>

<template>
  <Button 
    :type="pedingConfirmation ? 'primary':'secondary'"
    @click="onClick">
    {{ pedingConfirmation ? 'DO REMOVAL':'Delete' }}
  </Button>
</template>

<style scoped></style>
