import { describe, expect, test } from 'vitest'

describe('example test suite', () => {
  test('should correctly add two numbers', () => {
    const result = 2 + 2
    expect(result).toBe(4)
  })

  test('should properly handle string concatenation', () => {
    const str1 = 'Hello'
    const str2 = 'World'
    expect(str1 + ' ' + str2).toBe('Hello World')
  })

  test('should verify array operations', () => {
    const arr = [1, 2, 3]
    arr.push(4)
    expect(arr.length).toBe(4)
    expect(arr).toEqual([1, 2, 3, 4])
  })

  test('should check object properties', () => {
    const obj = { name: 'Test', value: 42 }
    expect(obj.name).toBe('Test')
    expect(obj.value).toBe(42)
  })

  test('should handle async operations', async () => {
    const promise = Promise.resolve('success')
    const result = await promise
    expect(result).toBe('success')
  })

  test('should validate error handling', () => {
    expect(
      () => {
        throw new Error('Test error')
      }
    ).toThrow('Test error')
  })
})