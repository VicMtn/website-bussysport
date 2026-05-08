import { onUnmounted, ref } from 'vue'

const DEFAULT_KEY = 'bussysport:contact:lastSubmit'
const DEFAULT_COOLDOWN_MS = 30_000

/**
 * Browser-side rate limiter for form submissions.
 *
 * Persists the last-attempt timestamp in localStorage so the cooldown
 * survives a full page reload — a naive bot loop that calls
 * window.location.reload() between submits still gets blocked.
 *
 * The server-side limiter in contact.php remains the security boundary;
 * this composable is purely there to spare the server obvious abuse and
 * give the user immediate feedback.
 *
 * @param {object} [options]
 * @param {string} [options.key]        localStorage key to use
 * @param {number} [options.cooldownMs] cooldown window in milliseconds
 * @param {() => number} [options.now]  injectable clock (tests)
 */
export function useSubmissionThrottle({
  key = DEFAULT_KEY,
  cooldownMs = DEFAULT_COOLDOWN_MS,
  now = () => Date.now(),
} = {}) {
  const cooldownLeft = ref(0) // seconds, ceiling
  let timer = null

  function readLastTs() {
    try {
      const raw = window.localStorage.getItem(key)
      const n = raw ? Number.parseInt(raw, 10) : 0
      return Number.isFinite(n) ? n : 0
    } catch {
      return 0
    }
  }

  function writeNow() {
    try {
      window.localStorage.setItem(key, String(now()))
    } catch {
      // Quota / private mode — silently degrade. The server still rate-limits.
    }
  }

  function refresh() {
    const remainingMs = Math.max(0, readLastTs() + cooldownMs - now())
    cooldownLeft.value = Math.ceil(remainingMs / 1000)
    if (remainingMs === 0 && timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  function ensureTicking() {
    if (timer === null && cooldownLeft.value > 0) {
      timer = setInterval(refresh, 1000)
    }
  }

  /**
   * Returns true and consumes the slot when the user is allowed to submit;
   * returns false when still inside the cooldown window.
   */
  function tryConsume() {
    refresh()
    if (cooldownLeft.value > 0) return false
    writeNow()
    refresh()
    ensureTicking()
    return true
  }

  // Initialise on call so a freshly mounted page already shows the
  // remaining cooldown if the user reloaded mid-window.
  refresh()
  ensureTicking()

  onUnmounted(() => {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  })

  return { cooldownLeft, tryConsume, refresh }
}
