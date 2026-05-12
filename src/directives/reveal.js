/**
 * v-reveal — adds `is-visible` to the bound element when it scrolls
 * into view. Replaces the per-page IntersectionObserver scripts in
 * the original static site.
 */
let observer = null

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
  )
  return observer
}

export default {
  mounted(el) {
    el.classList.add('reveal')
    getObserver().observe(el)
  },
  unmounted(el) {
    if (observer) observer.unobserve(el)
  },
}
