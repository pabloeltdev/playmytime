<script lang="ts" setup>
const colorMode = useColorMode()
</script>

<template>
  <div>
    <div class="logotipo">
      <img v-if="colorMode.value === 'light'" src="~/assets/img/logo_dark.png" alt="logotipo">
      <img v-else src="~/assets/img/logo_light.png" alt="logotipo">
    </div>
    <p>
      Hello, my name is Pablo Emanuell, I'm a software developer and I love programming.
      If you want know a bit more about me, look at my personal website available
      in <a class="text-link" href="https://pabloufrn.github.io">this link</a>.
    </p>
    <p>
      I created this application for fun, and because i wanted make a app that I
      could use on my own way, in the form I would like.
    </p>
    <p>
      That's why I created this music player. I choosed the library 
      <a class="text-link" href="https://vuejs.org">Vue.js</a> and the framework 
      <a class="text-link" href="https://nuxt.com/">Nuxt</a> and make a PWA. The player works
      entirely offline and strongly relies on the 
      <a class="text-link" href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API">
        File System Access API</a>.
    </p>
  </div>
</template>

<style scoped>
p {
  @apply text-justify
}
.logotipo {
  @apply max-w-sm mx-auto mb-20
}
</style>
