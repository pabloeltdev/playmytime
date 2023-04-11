<template>
  <div>
    <h1>
      Select your ambience:
    </h1>
    <ActionsHeader #right-actions>
      <Button @click="newAmbience">
        New Ambience
      </Button>
      
    </ActionsHeader>
    <div class="ambiences">
      <div class="ambience-item" v-for="ambience in ambiences" :key="ambience.id">
        <SquareItem 
          :title="ambience.name"
          :colors="ambience.colors"
          :icon-colors="ambience.iconColors"
          :icon="ambience.icon"
          :to="`/ambiences/${ambience.id}`"
          />
      </div>
    </div>
    <NuxtLink class="w-full" to="/playlists">
      <Button type="secondary" class="w-full">Skip to playlists</Button>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
import { Ambience } from '~~/utils/db';

let ambiences = ref<Ambience[]>([])

async function newAmbience() {
  const key = await createAmbience()
  const ambience = await fetchAmbience(+key)
  ambiences.value.push(ambience!)
}
onBeforeMount(async () => {
  ambiences.value = await fetchAllAmbiences()
})
</script>

<style scoped>
.ambiences {
  @apply my-5 grid gap-6 grid-cols-2
    sm:grid-cols-3 xl:grid-cols-4
}
</style>