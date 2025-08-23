import { ZodError } from 'zod'
import { logger } from '#utils/logger.js'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { schema } from '#schemas/css.js'
import yaml from 'js-yaml'

/**
 * @import { ThemeSchema } from "#schemas/css"
 */


/**
 * @async
 * Loads a YAML file and validates it against the provided schema.
 * @param {string} path - The path to the YAML file.
 * @returns {Promise<ThemeSchema>} The parsed YAML data.
 */
export const loadYAML = async (path) => {
  const cwd = process.cwd()
  const resolvedPath = resolve(cwd, path)
  logger.success(`Loading YAML file from ${resolvedPath}...`)

  try {
    const file = await readFile(resolvedPath, 'utf-8')
    const data = yaml.load(file)
    const parsed = schema.parse(data)
    logger.success(`Successfully loaded YAML file from ${resolvedPath}`)
    return parsed
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error(`Failed to validate YAML file from ${resolvedPath}: ${error.message}`)
      process.exit(1)
    }

    if (error instanceof Error) {
      logger.error(`Failed to load YAML file from ${resolvedPath}: ${error.message}`)
    }

    logger.error('Failed to load YAML file. Make sure the file exists and is valid YAML.')
    process.exit(1)
  }
}