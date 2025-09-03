// @ts-nocheck
import { beforeEach, describe, test, expect, vi } from 'vitest'
import { parse } from 'postcss'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { rules } from '#plugins/stylelinter'

vi.mock('node:fs', () => ({
  readFileSync: vi.fn(() => 'mock css content')
}))

vi.mock('node:path', () => ({
  resolve: vi.fn()
}))

vi.mock('postcss', () => ({
  parse: vi.fn()
}))

/**
 * @typedef {import('postcss').Root} PostCSSRoot
 * @typedef {import('postcss').Declaration} PostCSSDeclaration
 */

describe('stylelinter plugin', () => {
  /** @type {import('eslint').Rule.RuleContext} */
  const mockContext = {
    report: vi.fn(),
    id: 'test-rule',
    options: [],
    settings: {},
    parserPath: undefined,
    parserOptions: {},
    parserServices: {},
    env: {},
    sourceCode: {
      getText: vi.fn(),
      text: '',
      ast: {
        type: 'Program',
        body: [],
        comments: [],
        tokens: [],
        loc: { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } },
        range: [0, 0],
        sourceType: 'module'
      },
      lines: [],
      hasBOM: false,
      parserServices: {},
      visitorKeys: {},
      scopeManager: {
        scopes: [],
        globalScope: null,
        acquire: vi.fn(),
        getDeclaredVariables: vi.fn()
      },
      getTokens: vi.fn(),
      getAllComments: vi.fn(),
      getCommentsBefore: vi.fn(),
      getCommentsAfter: vi.fn(),
      getCommentsInside: vi.fn(),
      getTokenBefore: vi.fn(),
      getTokenAfter: vi.fn(),
      getFirstToken: vi.fn(),
      getLastToken: vi.fn(),
      isSpaceBetween: vi.fn()
    },
    filename: 'test.js',
    getFilename: () => 'test.js',
    cwd: '/mock/path',
    getCwd: () => '/mock/path',
    getPhysicalFilename: () => 'test.js',
    getScope: vi.fn(),
    getSourceCode: vi.fn(),
    markVariableAsUsed: vi.fn()
  }

  beforeEach(() => {
    vi.resetAllMocks()

    // Mock CSS parsing
    /** @type {PostCSSRoot} */
    const mockRoot = {
      walkDecls: vi.fn((callback) => {
        const declarations = [
          { prop: '--color-primary' },
          { prop: '--secondary' }
        ]
        declarations.forEach(callback)
      })
    }

    vi.mocked(readFileSync).mockReturnValue('mock css content')
    vi.mocked(parse).mockReturnValue(mockRoot)
    vi.mocked(resolve).mockReturnValue('/mock/path/styles.css')
  })

  test('should validate className with valid arbitrary color token', () => {
    const rule = rules['no-builtin-tailwind-colors'].create(mockContext)
    
    /** @type {import('estree').Node} */
    const node = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: { type: 'Literal', value: 'bg-[var(--color-primary)]' }
    }

    rule.JSXAttribute(node)
    expect(mockContext.report).not.toHaveBeenCalled()
  })

  test('should report invalid arbitrary color token', () => {
    const rule = rules['no-builtin-tailwind-colors'].create(mockContext)
    
    /** @type {import('estree').Node} */
    const node = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: { type: 'Literal', value: 'bg-[var(--invalid)]' }
    }

    rule.JSXAttribute(node)
    expect(mockContext.report).toHaveBeenCalled()
  })

  test('should validate shorthand token with opacity', () => {
    const rule = rules['no-builtin-tailwind-colors'].create(mockContext)
    
    /** @type {import('estree').Node} */
    const node = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: { type: 'Literal', value: 'bg-primary/50' }
    }

    rule.JSXAttribute(node)
    expect(mockContext.report).not.toHaveBeenCalled()
  })

  test('should validate exception tokens', () => {
    const rule = rules['no-builtin-tailwind-colors'].create(mockContext)
    
    /** @type {import('estree').Node} */
    const node = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: { type: 'Literal', value: 'bg-no-repeat text-lg' }
    }

    rule.JSXAttribute(node)
    expect(mockContext.report).not.toHaveBeenCalled()
  })

  test('should ignore non-color class names', () => {
    const rule = rules['no-builtin-tailwind-colors'].create(mockContext)
    
    /** @type {import('estree').Node} */
    const node = {
      type: 'JSXAttribute', 
      name: { name: 'className' },
      value: { type: 'Literal', value: 'flex p-4' }
    }

    rule.JSXAttribute(node)
    expect(mockContext.report).not.toHaveBeenCalled()
  })

  test('should ignore non-className attributes', () => {
    const rule = rules['no-builtin-tailwind-colors'].create(mockContext)
    
    /** @type {import('estree').Node} */
    const node = {
      type: 'JSXAttribute',
      name: { name: 'id' },
      value: { type: 'Literal', value: 'bg-primary' }
    }

    rule.JSXAttribute(node)
    expect(mockContext.report).not.toHaveBeenCalled()
  })

  test('should handle invalid opacity values', () => {
    const rule = rules['no-builtin-tailwind-colors'].create(mockContext)
    
    /** @type {import('estree').Node} */
    const node = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: { type: 'Literal', value: 'bg-primary/101' }
    }

    rule.JSXAttribute(node)
    expect(mockContext.report).toHaveBeenCalled()
  })

  test('should handle non-literal className values', () => {
    const rule = rules['no-builtin-tailwind-colors'].create(mockContext)
    
    /** @type {import('estree').Node} */
    const node = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: { type: 'JSXExpressionContainer' }
    }

    rule.JSXAttribute(node)
    expect(mockContext.report).not.toHaveBeenCalled()
  })

  test('should handle null className values', () => {
    const rule = rules['no-builtin-tailwind-colors'].create(mockContext)
    
    /** @type {import('estree').Node} */
    const node = {
      type: 'JSXAttribute', 
      name: { name: 'className' },
      value: null
    }

    rule.JSXAttribute(node)
    expect(mockContext.report).not.toHaveBeenCalled()
  })

  test('should handle non-string literal values', () => {
    const rule = rules['no-builtin-tailwind-colors'].create(mockContext)
    
    /** @type {import('estree').Node} */
    const node = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: { type: 'Literal', value: 123 }
    }

    rule.JSXAttribute(node)
    expect(mockContext.report).not.toHaveBeenCalled()
  })

  test('should validate shorthand token without opacity', () => {
    const rule = rules['no-builtin-tailwind-colors'].create(mockContext)
    
    /** @type {import('estree').Node} */
    const node = {
      type: 'JSXAttribute',
      name: { name: 'className' },
      value: { type: 'Literal', value: 'bg-primary' }
    }

    rule.JSXAttribute(node)
    expect(mockContext.report).not.toHaveBeenCalled()
  })
})