import { describe, expect, test, vi } from 'vitest'
import { logger } from '#utils/logger.js'

describe('Logger', () => {
  test('displays a success message on screen', () => {
    const logSpy = vi.spyOn(console, 'log')
    logger.success('Success message')
    expect(logSpy).toHaveBeenCalledWith('Success message')
    logSpy.mockRestore()
  })

  test('displays an error message on screen', () => {
    const logSpy = vi.spyOn(console, 'log')
    logger.error('Error message')
    expect(logSpy).toHaveBeenCalledWith('Error message')
    logSpy.mockRestore()
  })

  test('displays a warning message on screen', () => {
    const logSpy = vi.spyOn(console, 'log')
    logger.warn('Warning message')
    expect(logSpy).toHaveBeenCalledWith('Warning message')
    logSpy.mockRestore()
  })

  test('displays an info message on screen', () => {
    const logSpy = vi.spyOn(console, 'log')
    logger.info('Info message')
    expect(logSpy).toHaveBeenCalledWith('Info message')
    logSpy.mockRestore()
  })
})