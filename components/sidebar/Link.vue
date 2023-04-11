<script lang="ts" setup>
withDefaults(defineProps<{
  showContent: boolean
  to?: string,
  icon?: string,
}>(), {
  to: '#',
  icon: 'tag',
})
</script>

<template>
  <div>
    <NuxtLink active-class="sidebar-active-link" :to="to">
        <div class="sidebar-link">
          <Icon :name="icon"/>
          <Transition name="fade">
            <div v-show="showContent" class="content">
              <slot/>
            </div>
          </Transition>
        </div>
      </NuxtLink>
  </div>
</template>

<style scoped>

.sidebar-active-link .sidebar-link, .sidebar-link:hover {
  @apply bg-gray-400 dark:bg-slate-700
}
.sidebar-active-link .sidebar-link {
  cursor: default;
}
.content {
  @apply truncate
}
.sidebar-link {
  @apply flex gap-2 cursor-pointer px-2 py-1 rounded-md
}
</style>
