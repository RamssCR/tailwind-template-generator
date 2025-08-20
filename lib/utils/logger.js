import kleur from "kleur"

/**
 * Type definition for the logger functions
 * @typedef {(message: string) => void} Logger
 */

/**
 * @typedef {'info' | 'success' | 'warn' | 'error'} LogLevel
 */

/**
 * @type {Record<LogLevel, Logger>}
 */
export const logger = {
  info: (message) => console.log(kleur.blue(message)),
  success: (message) => console.log(kleur.green(message)),
  warn: (message) => console.log(kleur.yellow(message)),
  error: (message) => console.log(kleur.red(message))
}