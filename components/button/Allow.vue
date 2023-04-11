<template>
  <Button @click="requestLocalAccess">
    Allow access to local files
  </Button>
</template>

<script lang="ts" setup>
const emit = defineEmits(['allow', 'deny'])

async function requestLocalAccess() {
  const allow = await requestAccess()
  if (allow) {
    emit('allow')
  } else {
    emit('deny')
  }
}

</script>