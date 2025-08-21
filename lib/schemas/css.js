import { z } from 'zod'

const tokens = z.object({
  bg: z.string(),
  contrast: z.string(),
  accent: z.string(),
  foreground: z.string(),
  muted: z.string()
})

const themes = z.object({
  light: tokens,
  dark: tokens.optional(),
  custom: tokens.optional()
})

export const schema = z.object({
  primary: themes,
  secondary: themes,
  tertiary: themes.optional(),
})

/**
 * @typedef {z.infer<typeof schema>} ThemeSchema
 */