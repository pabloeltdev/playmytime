<script lang="ts" setup>
const props = defineProps<{
  id: string,
}>()
const { toggleModal } = useModal(props.id)
</script>

<template>
    <Button @click="toggleModal"><slot/></Button>
</template>

<style scoped></style>
