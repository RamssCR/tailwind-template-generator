import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/setupTest.js'],
    include: ['test/**/*.spec.js'],
    threads: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      all: true,
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90
      },
      exclude: [
        'test/**',
        'lib/index.js',
        'bin/index.js',
        '**/*.config.js',
        'scripts/**',
        'coverage/**',
        'html/**',
        'types/**'
      ]
    }
  }
})