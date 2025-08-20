# Tailwind Template Generator

![Pull Request Automation](https://github.com/RamssCR/tailwind-template-generator/actions/workflows/unit-testing.yaml/badge.svg)
![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)

---

`tailwind-template-generator` is a tailwind-focused library that provides a CLI to generate a CSS file based on a 
structured JSON file with the main pallete (`primary`, `secondary`, `terciary` being optional), a theme (`light` 
and `dark`) and the design tokens (`bg`, `contrast`, `accent`, `foreground` and `muted`)

Its main purpose is to avoid boilerplate when starting a new frontend project using TailwindCSS by providing it
a structured JSON file (preferably inside your project, like the root or an alternate directory like `src/data/**`)
and it creates a CSS file with basic Tailwind 4 features like `@import` and `@custom-variant` set to dark for dark mode.

---

## Index
- [Installation](#installation)
- [Usage](#usage)
- [CLI](#cli)
- [TypeScript](#typescript)
- [Tests](#tests)
- [Contributions](#contributions)

## Installation
Before installing the library you must have the following dependencies installed:
- `tailwindcss`: Preferably TailwindCSS 4.
- `stylelint`: Latest version.

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

Then, locate it where best suites inside your project (e.g., `src/data/colorPallete.json`) and run the following command afterwards:
```BASH
npx tailwind-template-generator generate src/data/collorPallete.json --out src/index.css # or globals.css, for example...
```

A CSS file with the provided name will be output in the specified directory.

## CLI
### `generate [source] --out [output]`
`generate` is used to generate the CSS file based on the provided JSON and receives two parameters:
- `source`: The origin of your JSON file inside your project.
- `output`: An existing directory to output your parsed CSS file.

> [!WARNING]
> The CLI throws an error when the source file does not exist, when the source file does not follow the schema in the example provided above at the [usage](#usage) section and when the output directory does not exist.

`tailwind-template-generator` uses `zod` under the hood to validate that the provided JSON follows a specific schema so your JSON can be used to
generate the proper CSS file. Below here is displayed a list of mandatory and optional parameters your JSON must follow at least:

| Property            | Mandatory      |
|---------------------|----------------|
| `primary`           | Yes            |
| `secondary`         | Yes            |
| `terciary`          | No             |
| `[pallete].light`   | Yes            |
| `[pallete].dark`    | No             |

> [!NOTE]
> While not mandatory, you can provide a JSON schema with a `primary` object with all mandatory/optional properties and a `secondary` object with just light colors. However, it's recommended to keep consistency on both sides by providing the same amount of properties.


## TypeScript
This library was made entirely using vanilla JS but also using a `tsconfig.json` file to generate all `.d.ts` files needed if the library 
provides an in-code resource.

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