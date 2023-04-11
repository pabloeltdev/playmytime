<script lang="ts" setup>
import { Music } from '~~/composables/states';

const props = defineProps<{
  music: Music,
}>()

async function play() {
  await playNowOrNext(props.music)
}
</script>

<template>
  <Button @click="play">Play next</Button>
</template>

<style scoped></style>
