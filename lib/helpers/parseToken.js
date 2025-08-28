import { ZodError } from 'zod'
import { extname } from 'node:path'
import { loadJSON } from '#loaders/json.js'
import { loadYAML } from '#loaders/yaml.js'
import { logger } from '#utils/logger.js'
import { schema } from '#schemas/css.js'
// For future integrations: import axios request to Figma

/**
 * @import { ThemeSchema } from '#schemas/css'
 */

/**
 * @async
 * Parses the token file based on its extension.
 * @param {string} source - The source file path.
 * @returns {Promise<ThemeSchema>} A promise that resolves to the parsed theme tokens.
 * @throws {Error} If the file cannot be read or parsed.
 * @example
 * const tokens = await parseToken('path/to/tokens.json');
 * const tokens = await parseToken('path/to/tokens.yaml');
 */
export const parseToken = async (source) => {
  const extension = extname(source).toLowerCase()
  /** @type {unknown} */
  let result

  switch (extension) {
    case '.json':
      result = await loadJSON(source)
      break
    case '.yml':
    case '.yaml':
      result = await loadYAML(source)
      break
    default: {
      logger.error(`Unsupported file type: ${extension}. Please provide a one of the following file types:`)
      logger.warn(`- .json`)
      logger.warn(`- .yaml`)
      throw new Error(`Unsupported file type: ${extension}`)
    }
  }

  try {
    return schema.parse(result)
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error('Failed to validate token file against the correct schema:')
      error.issues.forEach((issue) => {
        logger.warn(`- ${issue.path.join('.')}: ${issue.message}`)
      })
      process.exit(1)
    }

    logger.error('Failed to parse token file.')
    process.exit(1)
  }
}