import { logger } from '#utils/logger.js'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const cwd = process.cwd()

/**
 * @async
 * Loads a JSON file and validates if it follows the correct schema.
 * @param {string} path - The path to the JSON file.
 * @returns {Promise<unknown>} The parsed JSON data.
 * @throws {Error} If the file cannot be read or parsed.
 * @example
 * const data = await loadJSON('path/to/file.json');
 */
export const loadJSON = async (path) => {
  const resolvedPath = resolve(cwd, path)
  logger.success(`Loading JSON file from ${resolvedPath}...`)

  try {
    const file = await readFile(resolvedPath, 'utf-8')
    logger.success(`Successfully loaded JSON file from ${resolvedPath}`)
    return JSON.parse(file)
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to load JSON file: ${error.message}`)
      process.exit(1)
    }

    logger.error('Failed to load JSON file. Make sure the file exists and is valid JSON.')
    process.exit(1)
  }
}