export const useModal = (id: string) => {
  const modalId = id 
  const openedModal = useState<string | null>('openedModal', () => null)
  const toggleModal = () => {
    if (openedModal.value === modalId) {
      document.body.style.overflowY = 'scroll'
      return openedModal.value = null
    }
    document.body.style.overflow = 'hidden'
    openedModal.value = modalId
  }
  const closeModals = () => {
    if (openedModal.value != null) {
      document.body.style.overflowY = 'scroll'
      openedModal.value = null
    }
  }
  const showModal = computed(() => openedModal.value === modalId )
  return { showModal, toggleModal, closeModals }
}
