import { useAlerts } from "~~/composables/alerts"

export default defineNuxtPlugin(() => {
  const alerts = useAlerts()
  return {
    provide: {
      notify: (text: string) => {
        alerts.value.push(text)
        setTimeout(() => alerts.value.shift(), 5000)
      },
    }
  }
})
