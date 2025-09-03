import { ESLint } from 'eslint'
import { rules } from './stylelinter.js'

/**
 * @type {Record<string, ESLint.Plugin["configs"]>}
 */
export const configs = {
  recommended: {
    // @ts-expect-error: Type incoherence (but working anyways)
    plugins: ['tailwind-tokens'],
    rules: {
      // @ts-expect-error: Type incoherence (but working anyways)
      'tailwind-tokens/no-builtin-tailwind-colors': 'error'
    }
  }
}

const plugin = {
  rules,
  configs
}

export default plugin