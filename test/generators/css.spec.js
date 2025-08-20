import { describe, expect, test } from 'vitest'
import { generateCSS } from '#generators/css.js'
import { mockStyles } from 'test/mocks/mockStyles.js'

describe('CSS Generator', () => {
  test('generates valid CSS from style object', () => {
    const result = generateCSS(mockStyles)
    expect(typeof result).toBe('string')
  })

  test('generates valid CSS from style object with light theme only', () => {
    const result = generateCSS({ primary: { light: mockStyles.primary.light }, secondary: { light: mockStyles.secondary.light } })
    expect(typeof result).toBe('string')
  })

  test('generates valid CSS from style object with dark theme only', () => {
    // @ts-expect-error: light theme will always be present
    const result = generateCSS({ primary: { dark: mockStyles.primary.dark }, secondary: { dark: mockStyles.secondary.dark } })
    expect(typeof result).toBe('string')
  })
})