import { describe, expect, test, vi } from 'vitest'
import { loadJSON } from '#loaders/json.js'
import { loadYAML } from '#loaders/yaml.js'
import { parseToken } from '#helpers/parseToken.js'
import { logger } from '#utils/logger.js'

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

describe('parseToken', () => {
  test('should call loadJSON with the correct path', async () => {
    const mockPath = 'theme.json'
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
})