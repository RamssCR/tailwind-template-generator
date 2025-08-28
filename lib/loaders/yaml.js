import { logger } from '#utils/logger.js'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import yaml from 'js-yaml'

/**
 * @async
 * Loads a YAML file and validates it against the provided schema.
 * @param {string} path - The path to the YAML file.
 * @returns {Promise<unknown>} The parsed YAML data.
 */
export const loadYAML = async (path) => {
  const cwd = process.cwd()
  const resolvedPath = resolve(cwd, path)
  logger.success(`Loading YAML file from ${resolvedPath}...`)

  try {
    const file = await readFile(resolvedPath, 'utf-8')
    logger.success(`Successfully loaded YAML file from ${resolvedPath}`)
    return yaml.load(file)
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to load YAML file from ${resolvedPath}: ${error.message}`)
    }

    logger.error('Failed to load YAML file. Make sure the file exists and is valid YAML.')
    process.exit(1)
  }
}