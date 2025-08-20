/**
 * Generate a CSS file from the provided design tokens.
 * @param {import("#schemas/css").ThemeSchema} tokens - The design tokens to use.
 * @returns {string} CSS output as a string.
 * @example
 * const tokens = {
 *   colors: {
 *     primary: { light: { base: "#1DA1F2" }, dark: { base: "#0D8BDC" } },
 *     secondary: { light: { base: "#14171A" }, dark: { base: "#000000" } },
 *   },
 * };
 * const css = generateCSS(tokens);
 */
export const generateCSS = (tokens) => {
  const lines = []

  lines.push(`@import "tailwindcss";`, ``)

  lines.push(`:root {`)
  for (const [group, groupValue] of Object.entries(tokens)) {
    for (const [theme, themeValues] of Object.entries(groupValue)) {
      for (const [key, value] of Object.entries(themeValues)) {
        const suffix = theme === "light" ? "" : `-${theme}`;
        lines.push(`  --color-${group}-${key}${suffix}: ${value};`)
      }
    }
  }
  lines.push(`}`, ``)

  lines.push(`@custom-variant dark (&:is(.dark *));`, ``)

  lines.push(`@theme {`)
  for (const [group, groupValue] of Object.entries(tokens)) {
    const lightTokens = "light" in groupValue ? groupValue.light : groupValue
    for (const key of Object.keys(lightTokens)) {
      lines.push(`  --color-${group}-${key}: var(--color-${group}-${key});`)
    }
  }
  lines.push(`}`, ``)

  lines.push(`.dark {`)
  for (const [group, groupValue] of Object.entries(tokens)) {
    const darkTokens = 'dark' in groupValue && groupValue.dark ? groupValue.dark : {}
    for (const [key] of Object.entries(darkTokens)) {
      lines.push(`  --color-${group}-${key}: var(--color-${group}-${key}-dark);`)
    }
  }
  lines.push(`}`)

  return lines.join("\n")
}