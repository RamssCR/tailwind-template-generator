import { beforeEach, vi } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
  vi.resetAllMocks()
  vi.clearAllTimers()

  vi.spyOn(console, 'log').mockImplementation(vi.fn())
  vi.spyOn(console, 'error').mockImplementation(vi.fn())
  vi.spyOn(console, 'warn').mockImplementation(vi.fn())
  vi.spyOn(console, 'info').mockImplementation(vi.fn())
})
