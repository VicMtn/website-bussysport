import { onMounted, onUnmounted, ref } from 'vue'

const SCROLL_THRESHOLD = 70

export function useNavbarScroll() {
  const isScrolled = ref(false)

  function onScroll() {
    isScrolled.value = window.scrollY > SCROLL_THRESHOLD
  }

  onMounted(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { isScrolled }
}
