#!/usr/bin/env node
import { Command } from 'commander'
import { logger } from '#utils/logger.js'

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
  .action((source, options) => {
    logger.info(`Generating template from ${source}...`)
    logger.info(`Output will be saved to ${options.out}`)

    // TODO: Implement template generation logic
  })

program.parse()