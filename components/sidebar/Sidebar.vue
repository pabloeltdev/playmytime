<script lang="ts" setup>
const drawerOpen = ref(false)

const colorMode = useColorMode()

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}
</script>

<template>
  <div :class="['sidebar', { open: drawerOpen }]">
    <div class="sidebar-top">
      <Transition name="slide-left">
        <div v-show="drawerOpen" class="logo">
          <img v-if="colorMode.value === 'dark'" src="~/assets/img/logo_light.png" alt="logotipo">
          <img v-else src="~/assets/img/logo_dark.png" alt="logotipo">
        </div>
      </Transition>
      <Icon class="drawer-icon" name="menu" @click="toggleDrawer"></Icon>
    </div>
    <SidebarLink :show-content="drawerOpen" to="/" icon="home">Home page</SidebarLink>
    <SidebarLink :show-content="drawerOpen" to="/playlists" icon="music_note">Playlists</SidebarLink>
    <SidebarLink :show-content="drawerOpen" to="/queue" icon="queue_music">Queue</SidebarLink>
    <SidebarLink :show-content="drawerOpen" to="/ambiences" icon="self_improvement">Ambiences</SidebarLink>
    <SidebarLink :show-content="drawerOpen" to="/about" icon="info">About</SidebarLink>
  </div>
</template>

<style scoped>
.sidebar {
  transition-property: width;
  @apply fixed left-0 top-0 min-h-screen 
  px-2 flex flex-col gap-2 overflow-hidden 
  bg-indigo-200 dark:bg-slate-800
  select-none w-14 duration-500 ease-in-out
}
.sidebar.open {
  @apply w-52
}
.drawer-icon {
  @apply h-fit rounded-md flex px-2 py-1 cursor-pointer 
  hover:bg-slate-400 dark:hover:bg-slate-700
}
.sidebar-top {
  @apply flex items-start justify-end gap-4 mt-6 mb-20 h-10
}
</style>
