import { describe, test, expect, vi, beforeEach } from 'vitest'
import { MIN_REQUIRED_PALETTES, REQUIRED_TOKENS } from '#utils/constants.js'
import { figmaFormatter } from '#utils/formatter.js'
import { logger } from '#utils/logger.js'

vi.mock('#utils/logger.js', () => ({
  logger: {
    error: vi.fn(),
  }
}))

describe('figmaFormatter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('formats tokens into structure correctly', () => {
    const tokens = [
      { name: 'primary-light-100', value: '#fff', type: 'color' },
      { name: 'primary-light-200', value: '#eee', type: 'color' },
      { name: 'primary-light-300', value: '#ddd', type: 'color' },
      { name: 'primary-light-400', value: '#ccc', type: 'color' },
      { name: 'primary-light-500', value: '#bbb', type: 'color' },
      { name: 'secondary-light-100', value: '#123', type: 'color' },
      { name: 'secondary-light-200', value: '#234', type: 'color' },
      { name: 'secondary-light-300', value: '#345', type: 'color' },
      { name: 'secondary-light-400', value: '#456', type: 'color' },
      { name: 'secondary-light-500', value: '#567', type: 'color' },
    ]

    const result = figmaFormatter({ tokens })

    expect(result.primary.light['100']).toBe('#fff')
    expect(result.secondary.light['100']).toBe('#123')
  })

  test('throws if tokens is not an array', () => {
    expect(() => figmaFormatter({ tokens: undefined })).toThrow('Invalid input: tokens must be an array')
  })

  test('exits if fewer than two palettes', () => {
    const tokens = [
      { name: 'primary-light-100', value: '#fff', type: 'color' },
      { name: 'primary-light-200', value: '#eee', type: 'color' },
      { name: 'primary-light-300', value: '#ddd', type: 'color' },
      { name: 'primary-light-400', value: '#ccc', type: 'color' },
      { name: 'primary-light-500', value: '#bbb', type: 'color' },
    ]

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })

    expect(() => figmaFormatter({ tokens })).toThrow('exit')
    expect(logger.error).toHaveBeenCalledWith(
      `Invalid input: must provide at least ${MIN_REQUIRED_PALETTES} color palettes`
    )
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  test('exits if palette does not include light mode', () => {
    const tokens = [
      { name: 'primary-dark-100', value: '#000', type: 'color' },
      { name: 'secondary-light-100', value: '#111', type: 'color' },
      { name: 'secondary-light-200', value: '#222', type: 'color' },
      { name: 'secondary-light-300', value: '#333', type: 'color' },
      { name: 'secondary-light-400', value: '#444', type: 'color' },
      { name: 'secondary-light-500', value: '#555', type: 'color' },
    ]

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })

    expect(() => figmaFormatter({ tokens })).toThrow('exit')
    expect(logger.error).toHaveBeenCalledWith(
      "Invalid input: color palette 'primary' must include at least a 'light' mode"
    )
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  test('exits if mode has fewer than 5 tokens', () => {
    const tokens = [
      { name: 'primary-light-100', value: '#fff', type: 'color' },
      { name: 'primary-light-200', value: '#eee', type: 'color' },
      { name: 'primary-light-300', value: '#ddd', type: 'color' },
      { name: 'primary-light-400', value: '#ccc', type: 'color' },
      { name: 'secondary-light-100', value: '#123', type: 'color' },
      { name: 'secondary-light-200', value: '#234', type: 'color' },
      { name: 'secondary-light-300', value: '#345', type: 'color' },
      { name: 'secondary-light-400', value: '#456', type: 'color' },
      { name: 'secondary-light-500', value: '#567', type: 'color' },
    ]

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })

    expect(() => figmaFormatter({ tokens })).toThrow('exit')
    expect(logger.error).toHaveBeenCalledWith(
      `Invalid input: color palette 'primary' mode 'light' must include at least ${REQUIRED_TOKENS} tokens`
    )
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  test('ignores tokens with invalid name format', () => {
    const tokens = [
      { name: 'primary-light-100', value: '#fff', type: 'color' },
      { name: 'invalidtoken', value: '#000', type: 'color' },
      { name: 'secondary-light-100', value: '#123', type: 'color' },
      { name: 'secondary-light-200', value: '#234', type: 'color' },
      { name: 'secondary-light-300', value: '#345', type: 'color' },
      { name: 'secondary-light-400', value: '#456', type: 'color' },
      { name: 'secondary-light-500', value: '#567', type: 'color' },
      { name: 'primary-light-200', value: '#eee', type: 'color' },
      { name: 'primary-light-300', value: '#ddd', type: 'color' },
      { name: 'primary-light-400', value: '#ccc', type: 'color' },
      { name: 'primary-light-500', value: '#bbb', type: 'color' },
    ]

    const result = figmaFormatter({ tokens })
    expect(result.primary.light['100']).toBe('#fff')
  })

})