const Curry = require ("../Curry")

test ('curryN', () => {
  expect (Curry.curryN ((x, y) => x + y) (2) (3))
    .toEqual (5)
})

test ('uncurryN', () => {
  expect (Curry.uncurryN (a => b => a + b) (2, 3))
    .toEqual (5)
})

test ('uncurryN3', () => {
  expect (Curry.uncurryN3 (a => b => c => a + b + c) (2, 3, 8))
    .toEqual (13)
})

test ('uncurryN4', () => {
  expect (Curry.uncurryN4 (a => b => c => d => a + b + c + d) (2, 3, 8, 1))
    .toEqual (14)
})

test ('uncurryN5', () => {
  expect (Curry.uncurryN5 (a => b => c => d => e => a + b + c + d + e) (2, 3, 8, 1, 4))
    .toEqual (18)
})

test ('uncurryN6', () => {
  expect (Curry.uncurryN6 (a => b => c => d => e => f => a + b + c + d + e + f) (2, 3, 8, 1, 4, 5))
    .toEqual (23)
})

test ('uncurryN7', () => {
  expect (Curry.uncurryN7 (a => b => c => d => e => f => g => a + b + c + d + e + f + g)
                          (2, 3, 8, 1, 4, 5, 6))
    .toEqual (29)
})

test ('uncurryN8', () => {
  expect (Curry.uncurryN8 (a => b => c => d => e => f => g => h => a + b + c + d + e + f + g + h)
                          (2, 3, 8, 1, 4, 5, 6, 7))
    .toEqual (36)
})
