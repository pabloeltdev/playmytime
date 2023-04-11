export default defineNuxtRouteMiddleware(() => {
  const { closeModals } = useModal('')
  closeModals()
})
