<script lang="ts" setup>
const queue = useQueue()

async function clear() {
  queue.value = []
}

async function remove(index: number) {
  queue.value.splice(index, 1)
}
</script>

<template>
  <div>
    <h1>Music queue: </h1>
    <br>
    <MusicTable :musics="queue">
      <template #right-actions>
        <Button @click="clear">Clear</Button>
      </template>
      <template #default="{ index }">
        <Button type="action" @click="remove(index)">Remove</Button>
      </template>
      <template #no-musics>
        <span>The queue is empty.</span>
      </template>
    </MusicTable>
  </div>
</template>

<style scoped></style>
