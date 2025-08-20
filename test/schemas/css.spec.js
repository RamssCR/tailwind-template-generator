import { describe, expect, test } from 'vitest'
import { mockStyles } from 'test/mocks/mockStyles.js'
import { schema } from '#schemas/css.js'

describe('CSS Schema', () => {
  test('validates a correct style object', () => {
    const result = schema.safeParse(mockStyles)
    expect(result.success).toBe(true)
  })

  test('invalidates a style object with missing properties', () => {
    const result = schema.safeParse({ nonExistentProperty: 'value' })
    expect(result.success).toBe(false)
  })
})