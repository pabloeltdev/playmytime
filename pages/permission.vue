<template>
  <div>
    <span>
      Before playing music file you need give access to your music directories:
    </span>
    <ButtonAllow @allow="redirectBack"/>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()
const router = useRouter()
async function redirectBack() {
  const from = route.redirectedFrom
  if (from) {
    await router.push(from)
  } else {
    await router.push('/')
  }
}
</script>