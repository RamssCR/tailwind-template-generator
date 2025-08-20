import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { ZodError } from 'zod'
import { loadJSON } from '#loaders/json.js'
import { readFile } from 'node:fs/promises'
import { logger } from '#utils/logger.js'
import { schema } from '#schemas/css.js'

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
}))

vi.mock('#utils/logger.js', () => ({
  logger: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))
vi.mock('#schemas/css.js', () => ({
  schema: {
    parse: vi.fn(),
  },
}))


describe('loadJSON', () => {
  const mockCwd = '/mock-cwd'
  const mockPath = 'theme.json'

  beforeEach(() => {
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should handle ZodError and exit', async () => {
    const mockJson = JSON.stringify({ invalid: true })
    vi.mocked(readFile).mockResolvedValue(mockJson)
    const zodError = new ZodError([])
    vi.mocked(schema.parse).mockImplementation(() => { throw zodError })

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })

    await expect(loadJSON(mockPath)).rejects.toThrow('exit')
    expect(logger.error).toHaveBeenCalledWith(`Invalid JSON schema: ${zodError}`)
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  test('should handle generic Error and exit', async () => {
    vi.mocked(readFile).mockResolvedValue('not-json')
    vi.mocked(schema.parse).mockImplementation(() => { throw new Error('Parse error') })

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })

    await expect(loadJSON(mockPath)).rejects.toThrow('exit')
    expect(logger.error).toHaveBeenCalledWith(`Failed to load JSON file: Unexpected token 'o', \"not-json\" is not valid JSON`)
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  test('should handle readFile error and exit', async () => {
    vi.mocked(readFile).mockRejectedValue(new Error('File not found'))

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })

    await expect(loadJSON(mockPath)).rejects.toThrow('exit')
    expect(logger.error).toHaveBeenCalledWith('Failed to load JSON file: File not found')
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  test('should handle unknown error and exit', async () => {
    vi.mocked(readFile).mockRejectedValue('unknown error')

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })

    await expect(loadJSON(mockPath)).rejects.toThrow('exit')
    expect(logger.error).toHaveBeenCalledWith('Failed to load JSON file. Make sure the file exists and is valid JSON.')
    expect(exitSpy).toHaveBeenCalledWith(1)
  })
})