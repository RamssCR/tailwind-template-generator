import { describe, expect, test, vi } from 'vitest'
import { ZodError } from 'zod'
import { loadJSON } from '#loaders/json.js'
import { loadYAML } from '#loaders/yaml.js'
import { logger } from '#utils/logger.js'
import { parseToken } from '#helpers/parseToken.js'
import { schema } from '#schemas/css.js'

vi.mock('#loaders/json.js', () => ({
  loadJSON: vi.fn(),
}))

vi.mock('#loaders/yaml.js', () => ({
  loadYAML: vi.fn(),
}))

vi.mock('#utils/logger.js', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('#schemas/css.js', () => ({
  schema: {
    parse: vi.fn()
  }
}))

describe('parseToken', () => {
  test('should call loadJSON with the correct path', async () => {
    const mockPath = 'theme.json'
    vi.mocked(schema.parse).mockImplementation(() => ({
      primary: {
        light: { bg: '#ffffff', contrast: '#000000', muted: '#f0f0f0', foreground: '#000000', accent: '#3b82f6' },
      },
      secondary: {
        light: { bg: '#f0f0f0', contrast: '#000000', muted: '#ffffff', foreground: '#000000', accent: '#3b82f6' },
      },
    }))
    await parseToken(mockPath)
    expect(loadJSON).toHaveBeenCalledWith(mockPath)
  })

  test('calls loadYAML with the correct path (case for .yaml files)', async () => {
    const mockPath = 'theme.yaml'
    await parseToken(mockPath)
    expect(loadYAML).toHaveBeenCalledWith(mockPath)
  })

  test('calls loadYAML with the correct path (case for .yml files)', async () => {
    const mockPath = 'theme.yml'
    await parseToken(mockPath)
    expect(loadYAML).toHaveBeenCalledWith(mockPath)
  })

  test('calls loadJSON with an incorrect path', async () => {
    vi.spyOn(vi.mocked(loadJSON), 'mockImplementation').mockRejectedValue(new Error('File not found'))
    const mockPath = 'invalid.json'
    await parseToken(mockPath)
    expect(loadJSON).toHaveBeenCalledWith(mockPath)
  })

  test('should throw error for unsupported file type', async () => {
    const badPath = 'tokens.txt'

    await expect(parseToken(badPath)).rejects.toThrow('Unsupported file type: .txt')

    expect(logger.error).toHaveBeenCalledWith(
      'Unsupported file type: .txt. Please provide a one of the following file types:'
    )
    expect(logger.warn).toHaveBeenNthCalledWith(1, '- .json')
    expect(logger.warn).toHaveBeenNthCalledWith(2, '- .yaml')
  })

  test('exits process with ZodError', async () => {
    const mockPath = 'theme.json'
    vi.mocked(loadJSON).mockResolvedValue({})

    vi.mocked(schema.parse).mockImplementation(() => {
      throw new ZodError([
        { path: ['primary'], message: 'Required', code: 'custom' }
      ])
    })

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit')
    })

    await expect(parseToken(mockPath)).rejects.toThrow('exit')
    expect(logger.error).toHaveBeenCalledWith(
      'Failed to validate token file against the correct schema:'
    )
    expect(logger.warn).toHaveBeenCalledWith('- primary: Required')
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  test('exits process with generic Error', async () => {
    const mockPath = 'theme.json'
    vi.mocked(loadJSON).mockResolvedValue({})

    vi.mocked(schema.parse).mockImplementation(() => {
      throw new Error('Unexpected failure')
    })

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit')
    })

    await expect(parseToken(mockPath)).rejects.toThrow('exit')

    expect(logger.error).toHaveBeenCalledWith(
      'Failed to parse token file.'
    )
    expect(exitSpy).toHaveBeenCalledWith(1)
  })
})