#!/usr/bin/env node
import { Command } from 'commander'
import { generateCSS } from '#generators/css.js'
import { logger } from '#utils/logger.js'
import { writeFile } from 'node:fs/promises'
import { parseToken } from '#helpers/parseToken.js'

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

program.parse()