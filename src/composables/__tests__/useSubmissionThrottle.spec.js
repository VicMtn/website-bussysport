import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSubmissionThrottle } from '../useSubmissionThrottle'

const KEY = 'test:throttle'

describe('useSubmissionThrottle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    window.localStorage.clear()
  })

  it('lets the first attempt through and persists the timestamp', () => {
    let now = 1_000_000
    const { cooldownLeft, tryConsume } = useSubmissionThrottle({
      key: KEY,
      cooldownMs: 30_000,
      now: () => now,
    })

    expect(cooldownLeft.value).toBe(0)
    expect(tryConsume()).toBe(true)
    expect(window.localStorage.getItem(KEY)).toBe('1000000')
    expect(cooldownLeft.value).toBe(30)
  })

  it('blocks a second attempt inside the cooldown window', () => {
    let now = 1_000_000
    const { tryConsume, cooldownLeft } = useSubmissionThrottle({
      key: KEY,
      cooldownMs: 30_000,
      now: () => now,
    })

    expect(tryConsume()).toBe(true)

    now += 5_000 // 5 s later
    expect(tryConsume()).toBe(false)
    expect(cooldownLeft.value).toBe(25)

    now += 24_999 // 0.001 s before the window closes
    expect(tryConsume()).toBe(false)
    expect(cooldownLeft.value).toBe(1)
  })

  it('lets the next attempt through once the window expires', () => {
    let now = 1_000_000
    const { tryConsume } = useSubmissionThrottle({
      key: KEY,
      cooldownMs: 30_000,
      now: () => now,
    })

    expect(tryConsume()).toBe(true)
    now += 30_001
    expect(tryConsume()).toBe(true)
  })

  it('reflects a cooldown carried over from a previous page load', () => {
    // Simulate a previous submission persisted in localStorage.
    window.localStorage.setItem(KEY, String(2_000_000))

    let now = 2_010_000 // 10 s after the previous attempt
    const { cooldownLeft, tryConsume } = useSubmissionThrottle({
      key: KEY,
      cooldownMs: 30_000,
      now: () => now,
    })

    expect(cooldownLeft.value).toBe(20)
    expect(tryConsume()).toBe(false)
  })

  it('decrements cooldownLeft via the reactive timer', () => {
    let now = 5_000_000
    const { cooldownLeft, tryConsume } = useSubmissionThrottle({
      key: KEY,
      cooldownMs: 30_000,
      now: () => now,
    })

    tryConsume()
    expect(cooldownLeft.value).toBe(30)

    now += 1_000
    vi.advanceTimersByTime(1_000)
    expect(cooldownLeft.value).toBe(29)

    now += 28_000
    vi.advanceTimersByTime(28_000)
    expect(cooldownLeft.value).toBe(1)

    now += 1_000
    vi.advanceTimersByTime(1_000)
    expect(cooldownLeft.value).toBe(0)
  })

  it('treats a corrupted localStorage value as no previous submission', () => {
    window.localStorage.setItem(KEY, 'not-a-number')
    const { cooldownLeft, tryConsume } = useSubmissionThrottle({
      key: KEY,
      cooldownMs: 30_000,
      now: () => 9_999_999,
    })

    expect(cooldownLeft.value).toBe(0)
    expect(tryConsume()).toBe(true)
  })
})
