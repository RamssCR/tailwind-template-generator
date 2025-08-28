import { logger } from "./logger.js"

/**
 * @typedef {object} Token
 * @property {string} name - The name of the token.
 * @property {string} value - The value of the token.
 * @property {string} type - The type of the token (e.g., color, spacing).
 */

/**
 * @typedef {{[palette: string]: {[mode: string]: Record<string, string>}}} TokenGroup
 */


/**
 * Formats the input from Figma - W3C Design Tokens JSON file
 * @param {object} input - The input object containing an array of tokens.
 * @param {Token[]} [input.tokens] - The array of tokens to be formatted.
 * @returns {TokenGroup} The formatted token group.
 */
export const figmaFormatter = ({ tokens }) => {
  if (!tokens || !Array.isArray(tokens)) {
    throw new Error('Invalid input: tokens must be an array')
  }

  /** @type {TokenGroup} */
  const structure = {}

  for (const token of tokens) {
    const splitted = token.name.split('-')
    if (splitted.length < 3) continue

    const [palette, mode, tokenName] = splitted

    if (!structure[palette]) {
      structure[palette] = {}
    }
    if (!structure[palette][mode]) {
      structure[palette][mode] = {}
    }
    structure[palette][mode][tokenName] = token.value
  }

  const palettes = Object.keys(structure)
  if (palettes.length < 2) {
    logger.error('Invalid input: must provide at least two color palettes')
    process.exit(1)
  }
  
  for (const palette of palettes) {
    const modes = Object.keys(structure[palette])

    if (!modes.includes('light')) {
      logger.error(`Invalid input: color palette '${palette}' must include at least a 'light' mode`)
      process.exit(1)
    }

    for (const mode of modes) {
      const tokens = Object.keys(structure[palette][mode])
      if (tokens.length < 5) {
        logger.error(`Invalid input: color palette '${palette}' mode '${mode}' must include at least 5 tokens`)
        process.exit(1)
      }
    }
  }

  return structure
}