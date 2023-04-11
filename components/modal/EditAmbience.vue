<script lang="ts" setup>
import { Ambience } from '~~/utils/db';

const props = defineProps<{
  ambience: Ambience,
  id: string,
}>()
const emit = defineEmits(['cancel', 'change'])

const router = useRouter()

function changeIcon(icon: string) {
  props.ambience.icon = icon
  emit('change')
}
async function deleteThisAmbience() {
  await deleteAmbience(props.ambience.id!)
  await router.push('/ambiences')
}
</script>

<template>
  <Modal :id="id" title="Edit ambience"
    @cancel="emit('cancel')"
  >
    <div class="edit">
      <div class="top">
        <SquareItem class="square" 
          :colors="ambience.colors"
          :icon="ambience.icon"
          :icon-colors="ambience.iconColors"/>
        <div class="right">
          <div class="name">
            <span>Name: </span>
            <input 
              @change="emit('change')" 
              v-model="ambience.name"
              type="text" maxlength="20">
          </div>
          <div class="colors">
            <span>Colors:</span>
            <input v-model="ambience.colors[0]" type="color" @change="emit('change')">
            <input v-model="ambience.colors[1]" type="color" @change="emit('change')">
            <input v-model="ambience.iconColors[0]" type="color" @change="emit('change')">
            <input v-model="ambience.iconColors[1]" type="color" @change="emit('change')">
          </div>
        </div>
      </div>
      <div class="bot">
        <div :class="['icon', {
          active: icon === ambience.icon
        }]"
          v-for="(icon, index) in icons" :key="index" @click="changeIcon(icon)">
          <Icon :name="icon"/>
        </div>
      </div>
      <ButtonDelete @delete="deleteThisAmbience"/>
    </div>
  </Modal>
</template>

<style scoped>
.edit { 
  @apply flex flex-col gap-4 max-w-lg
}
.top {
  @apply flex gap-6
}
.square {
  @apply w-32
}
.right {
  @apply flex flex-col gap-6 grow
}
.name {
  @apply flex self-start items-center gap-2 w-full
}
.name input {
  @apply dark:bg-slate-800 h-10 w-full
}
.colors {
  @apply flex items-center gap-2
}
.colors input {
  @apply w-11 h-12 bg-transparent
}
.bot {
  @apply mx-auto flex flex-wrap justify-center content-start h-48 gap-2 p-4 rounded-md 
  bg-slate-200 dark:bg-slate-800
}
.icon {
  @apply flex h-fit rounded-md p-1 border-2 border-slate-400
    cursor-pointer hover:bg-slate-400 select-none
}
.icon.active {
  @apply border-slate-900 text-slate-900
  dark:border-violet-600 dark:text-violet-600 
  hover:bg-transparent cursor-default
}
</style>
