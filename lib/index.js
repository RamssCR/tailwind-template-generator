#!/usr/bin/env node
import { Command } from 'commander'
import { figmaFormatter } from '#utils/formatter.js'
import { generateCSS } from '#generators/css.js'
import { loadJSON } from '#loaders/json.js'
import { logger } from '#utils/logger.js'
import { parseToken } from '#helpers/parseToken.js'
import { schema } from '#schemas/css.js'
import { writeFile } from 'node:fs/promises'

/** @import { Token } from "#utils/formatter" */

const program = new Command()

program
  .name('tailwind-template-generator')
  .description('A CLI tool for generating Tailwind CSS templates')
  .version('1.0.0')

program
  .command('generate')
  .description('Generate a new Tailwind CSS template from an input file')
  .argument("<source>", "File where your tokens are stored (JSON or YAML)")
  .option('-o, --out <output>', 'Output CSS file', 'tokens.css')
  .action(async (source, options) => {
    logger.info(`Generating template from ${source}...`)

    try {
      const tokens = await parseToken(source)
      const css = generateCSS(tokens)
      await writeFile(options.out, css, "utf-8")
      logger.success(`Template generated successfully at ${options.out}`)
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to generate template: ${error.message}`)
      }
    }
  })

program
  .command('figma')
  .description('Generate a new Tailwind CSS template from an exported Figma Tokens JSON file')
  .argument("<source>", "Figma Tokens JSON file")
  .option('-o, --out <output>', 'Output CSS file', 'tokens.css')
  .action(async (source, options) => {
    logger.info(`Generating template from ${source}...`)

    try {
      const tokens = await loadJSON(source)
      const format = figmaFormatter(/** @type {{ tokens?: Token[] }} */(tokens))
      const result = schema.parse(format)
      const css = generateCSS(result)
      await writeFile(options.out, css, "utf-8")
      logger.success(`Template generated successfully at ${options.out}`)
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to generate template: ${error.message}`)
      }
    }
  })

program.parse()