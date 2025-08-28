import { 
  afterEach, 
  beforeEach,
  describe, 
  expect, 
  test, 
  vi 
} from 'vitest'
import { loadYAML } from '#loaders/yaml.js'
import { logger } from '#utils/logger.js'
import { readFile } from 'node:fs/promises'
import yaml from 'js-yaml'

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn()
}))

vi.mock('#utils/logger.js', () => ({
  logger: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock('js-yaml', async (importOriginal) => ({
  ...(await importOriginal()),
  load: vi.fn()
}))

describe('loadYAML', () => {
  const mockCwd = "/mock-cwd"
  const mockPath = "mock-path.yaml"

  beforeEach(() => {
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should handle yaml.load error and exit', async () => {
    const invalidYaml = '{'
    const yamlError = new Error('Invalid YAML')

    vi.mocked(readFile).mockResolvedValue(invalidYaml)
    yaml.load = vi.fn().mockImplementation(() => { throw yamlError })

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })

    await expect(loadYAML(mockPath)).rejects.toThrow('exit')
    expect(logger.error).toHaveBeenCalledWith("Failed to load YAML file. Make sure the file exists and is valid YAML.")
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  test('should handle readFile error and exit', async () => {
    const fileError = new Error('ENOENT: File not found')
    vi.mocked(readFile).mockRejectedValue(fileError)

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })

    await expect(loadYAML(mockPath)).rejects.toThrow('exit')
    expect(logger.error).toHaveBeenCalled()
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  test('should handle unknown errors and exit', async () => {
    vi.mocked(readFile).mockRejectedValue('Unknown error')

    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit') })

    await expect(loadYAML(mockPath)).rejects.toThrow('exit')
    expect(logger.error).toHaveBeenCalledWith('Failed to load YAML file. Make sure the file exists and is valid YAML.')
    expect(exitSpy).toHaveBeenCalledWith(1)
  })
})