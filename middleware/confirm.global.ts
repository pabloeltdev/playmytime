export default defineNuxtRouteMiddleware((to, from) => {
  const error = useError()
  
  if (to.path !== '/' || from.path === '/') return
  if (error.value) {
    clearError()
    return
  }
  const result = window.confirm(
    `Are you sure you want to go back to ${to.name?.toString() ?? to.path} page?`
  )
  if (result) return
  return abortNavigation()
})
