export default defineNuxtRouteMiddleware(async () => {
  if (await hasAccess()) return
  return navigateTo('/permission')
})