# Tailwind Template Generator

![Pull Request Automation](https://github.com/RamssCR/tailwind-template-generator/actions/workflows/unit-testing.yaml/badge.svg)
![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)

---

`tailwind-template-generator` is a tailwind-focused library that provides a CLI to generate a CSS file based on a 
structured JSON/YAML file with the main palette (`primary`, `secondary`, `tertiary` being optional), a theme (`light` 
and `dark`) and the design tokens (`bg`, `contrast`, `accent`, `foreground` and `muted`)

Its main purpose is to avoid boilerplate when starting a new frontend project using TailwindCSS by providing it
a structured JSON/YAML file (preferably inside your project, like the root or an alternate directory like `src/data/**`)
and it creates a CSS file with basic Tailwind 4 features like `@import` and `@custom-variant` set to dark for dark mode.

`tailwind-template-generator` has also included support for Figma W3C Design Tokens, following named design tokens pattern rather than
scales to align with the library's naming conventions for CSS variables.

---

## Index
- [Installation](#installation)
- [Usage](#usage)
- [YAML Files](#yaml-files)
- [W3C Design Tokens](#w3c-design-tokens)
- [CLI](#cli)
- [ESLint Plugin](#eslint-plugin)
- [TypeScript](#typescript)
- [Tests](#tests)
- [Contributions](#contributions)
- [Changelog](#changelog)

## Installation
Before installing the library you must have the following dependencies installed:
- `tailwindcss`: Preferably TailwindCSS 4.

Install the library by running the following command on your console:

```BASH
# For npm
npm install tailwind-template-generator -D
```

```BASH
# For pnpm
pnpm add tailwind-template-generator -D
```

```BASH
# For yarn
yarn add tailwind-template-generator -D
```

## Usage
To create a CSS file based on a JSON file, you must first structure it so it can be parsed by TTG.

Here's a basic example of how your JSON should look like:
```JSON
{
  "primary": {
    "light": {
      "bg": "#ffffff",
      "contrast": "#000000",
      "accent": "#ff0000",
      "foreground": "#1a1a1a",
      "muted": "#f0f0f0"
    },
    "dark": {
      "bg": "#111827",
      "contrast": "#f9fafb",
      "accent": "#3b82f6",
      "foreground": "#e5e7eb",
      "muted": "#1f2937"
    }
  },
  "secondary": {
    "light": {
      "bg": "#f0f0f0",
      "contrast": "#1a1a1a",
      "accent": "#00ff00",
      "foreground": "#2a2a2a",
      "muted": "#e0e0e0"
    },
    "dark": {
      "bg": "#1f2937",
      "contrast": "#e5e7eb",
      "accent": "#a855f7",
      "foreground": "#f9fafb",
      "muted": "#111827"
    }
  }
}
```

Then, locate it where best suits inside your project (e.g., `src/data/colorPalette.json`) and run the following command afterwards:
```BASH
npx tailwind-template-generator generate src/data/colorPalette.json --out src/index.css # or globals.css, for example...
```

A CSS file with the provided name will be output in the specified directory.

## YAML Files
You can also use YAML files to generate a CSS output similar to using a JSON file by following a similar structure:

```YAML
primary:
  light:
    bg: "oklch(99% 0.01 240)"
    contrast: "oklch(30% 0.01 240)"
    accent: "oklch(70% 0.18 30)"
    foreground: "oklch(40% 0.05 240)"
    muted: "oklch(95% 0.02 240)"
  dark:
    bg: "oklch(20% 0.02 240)"
    contrast: "oklch(99% 0.01 240)"
    accent: "oklch(60% 0.20 250)"
    foreground: "oklch(40% 0.05 240)"
    muted: "oklch(25% 0.03 240)"
secondary:
  light:
    bg: "oklch(98% 0.01 320)"
    contrast: "oklch(32% 0.01 320)"
    accent: "oklch(75% 0.18 340)"
    foreground: "oklch(42% 0.05 320)"
    muted: "oklch(94% 0.02 320)"
  dark:
    bg: "oklch(18% 0.02 320)"
    contrast: "oklch(97% 0.01 320)"
    accent: "oklch(62% 0.20 340)"
    foreground: "oklch(88% 0.03 320)"
    muted: "oklch(23% 0.03 320)"
```

> [!NOTE]
> You can use YAML files having both `.yaml` and `.yml` file extensions.

## W3C Design Tokens
You can also provide JSON files exported from Figma as W3C Design Tokens following naming convention (not scales).
Your JSON must likely look like this:

```JSON
{
  "tokens": [
    { "name": "primary-light-bg", "value": "oklch(100% 0 0)", "type": "color" },
    { "name": "primary-light-contrast", "value": "oklch(0% 0 0)", "type": "color" },
    { "name": "primary-light-muted", "value": "oklch(93.6% 0.012 99.6)", "type": "color" },
    { "name": "primary-light-accent", "value": "oklch(56.6% 0.207 264.7)", "type": "color" },
    { "name": "primary-light-foreground", "value": "oklch(36.5% 0.174 264.7)", "type": "color" },

    { "name": "primary-dark-bg", "value": "oklch(8.1% 0.004 0)", "type": "color" },
    { "name": "primary-dark-contrast", "value": "oklch(100% 0 0)", "type": "color" },
    { "name": "primary-dark-muted", "value": "oklch(27.2% 0.012 0)", "type": "color" },
    { "name": "primary-dark-accent", "value": "oklch(56.6% 0.207 264.7)", "type": "color" },
    { "name": "primary-dark-foreground", "value": "oklch(73.2% 0.164 264.7)", "type": "color" },

    { "name": "secondary-light-bg", "value": "oklch(98.2% 0.004 99.6)", "type": "color" },
    { "name": "secondary-light-contrast", "value": "oklch(20.5% 0.045 99.6)", "type": "color" },
    { "name": "secondary-light-muted", "value": "oklch(86.5% 0.012 99.6)", "type": "color" },
    { "name": "secondary-light-accent", "value": "oklch(63.2% 0.233 328.7)", "type": "color" },
    { "name": "secondary-light-foreground", "value": "oklch(52.2% 0.207 328.7)", "type": "color" }
  ]
}
```

And by running the following command, you can generate your CSS file:

```BASH
npx tailwind-template-generator figma src/data/tokens.json --out src/index.css # or globals.css (for example)
```

## CLI
### `generate [source] --out [output]`
`generate` is used to generate the CSS file based on the provided JSON/YAML and receives two parameters:
- `source`: The origin of your JSON/YAML file inside your project.
- `output`: An existing directory to output your parsed CSS file.

> [!WARNING]
> The CLI throws an error when the source file does not exist, when the source file does not follow the schema in the examples provided above at the [usage](#usage) section and when the output directory does not exist.

`tailwind-template-generator` uses `zod` under the hood to validate that the provided JSON/YAML follows a specific schema so your JSON/YAML can be used to generate the proper CSS file. Below here is displayed a list of mandatory and optional parameters your JSON/YAML file must follow at least:

| Property            | Mandatory      |
|---------------------|----------------|
| `primary`           | Yes            |
| `secondary`         | Yes            |
| `tertiary`          | No             |
| `[palette].light`   | Yes            |
| `[palette].dark`    | No             |

> [!NOTE]
> While not mandatory, you can provide a JSON/YAML schema with a `primary` object with all mandatory/optional properties and a `secondary` object with just light colors. However, it's recommended to keep consistency on both sides by providing the same amount of properties.

### `figma [source] --out [output]`
This command apply the same action as above, this command will only apply to JSON files (only) provided by Figma W3C Design Tokens.

> [!NOTE]
> This command is only for W3C Design Tokens format. If used with `generate`, it won't generate the CSS file due to schema insconsistency.

## ESLint Plugin
`tailwind-template-generator` (from version 1.3.0) includes an ESLint plugin that can be added to your configuration file (works for both JavaScript and TypeScript), which validates that your JSX file uses the variables declared on your CSS file generated from the library's CLI (or even your own CSS file with variables for tailwind 4 if you only need the ESLint plugin).

> [!NOTE]
> Currently, this plugin only validates a file named `index.css` located inside your `/src` folder.

You can add it to your `eslint.config.*` file this way:
```TS
// eslint.config.js

// @ts-check
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import tailwindTokens from 'tailwind-template-generator'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{jsx,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'tailwind-tokens': tailwindTokens
    },
    rules: {
      'tailwind-tokens/no-builtin-tailwind-colors': 'error'
    }
  },
])
```

### How it works
This plugin validates your CSS file and parses it using the `postcss` library under the hood, it throws an alert if
you try using a built-in tailwind color (e.g. `text-red-500`, `bg-teal-600`) and handles arbitrary values consistently.

For example: If your CSS file contains a variable named `--color-primary-bg`, adding it as an arbitrary class will be
handle correctly.

- `bg-[var(--color-primary-bg)]`: Won't throw an (ESLint) error.
- `bg-[var(--color-primary-b)]`: Incomplete naming, variable not on your CSS file, will throw an error.
- `bg-[var(--color-primary-bgf)]`: Extra character (possibly a typo), not on your CSS file, will throw an error.

### Shorthand limitations
TailwindCSS' shorthands are mostly used due to easier readability and variable recognition thanks to `postcss`. However,
in a linter context they’re trickier to validate. Arbitrary values can be mapped directly (e.g. `text-[20px]` vs `text-[var(--color-primary-bg)]`), 
but shorthands require inference.

Shorthands don't have the same benefit, so in this case it's handled almost completely with some alert inconsistencies that won't affect 
your CSS generated variables or other different utility classes unrelated to colors.

- `text-primary-bg`: Detected correctly.
- `text-primary-b`: Not incomplete variable detection. Won't throw an error.
- `text-primary-bgf`: Typo detected correctly. Throws an error.
- `text-primary-bg/10`: Opacity modifiers detected correctly.
- `text-primary-acce`: Typo for "accent" word. Detects incomplete variable naming in this case.

> [!NOTE]
> Utility classes unrelated to colors (like `bg-no-repeat`, `text-lg`, `text-center`, `border-4`) are safely whitelisted to avoid false positives.

## TypeScript
This library was made entirely using vanilla JS but also using a `tsconfig.json` file to generate all `.d.ts` files needed if the library provides an in-code resource (in the future).

## Tests
In order to run the library's tests, you can run the following command on your console:
```BASH
npm test
```

To see a coverage report, run the following command:
```BASH
npm run test:coverage
```

## Contributions
All contributions are welcome to the `tailwind-template-generator` library, keep in mind to:
- Document all changes in the `README` file, as well as the `CHANGELOG` file.
- Create tests for your integration/fix.
- Follow the library's code conventions.
- Open a PR requesting changes.

## Changelog
Wanna have a look at our `CHANGELOG` to see a timeline of TTG's changes? Visit our GitHub repository's
[CHANGELOG](https://github.com/RamssCR/tailwind-template-generator/blob/develop/CHANGELOG.md).