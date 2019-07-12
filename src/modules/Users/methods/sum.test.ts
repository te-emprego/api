import { sum } from './sum'

test('basic', () => {
  expect(sum()).toBe(0)
})

test('basic again', () => {
  expect(sum(1, 2, 3)).toBe(6)
})
