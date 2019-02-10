// @ts-check
const { fromBoth, fromBinary, bimap, first, second, fst, snd, curry, uncurry, swap, toArray, fromArray, isPair } = require('../Pair')

// CONSTRUCTOR

test ('fromBoth', () => {
  const pair = fromBoth (3) (1)
  expect (pair .first) .toEqual (3)
  expect (pair .second) .toEqual (1)
  expect (pair .isPair) .toEqual (true)
})

test ('fromBinary', () => {
  const pair = fromBinary (3, 1)
  expect (pair .first) .toEqual (3)
  expect (pair .second) .toEqual (1)
  expect (pair .isPair) .toEqual (true)
})

// BIFUNCTOR

test ('bimap', () => {
  expect (bimap (a => a + 2) (b => b + 3) (fromBoth (3) (1)))
    .toEqual (fromBoth (5) (4))
})

test ('first', () => {
  expect (first (a => a + 2) (fromBoth (3) (1))) .toEqual (fromBoth (5) (1))
})

test ('second', () => {
  expect (second (b => b + 3) (fromBoth (3) (1))) .toEqual (fromBoth (3) (4))
})

// PAIR FUNCTIONS

test ('fst', () => {
  expect (fst (fromBoth (3) (1))) .toEqual (3)
})

test ('snd', () => {
  expect (snd (fromBoth (3) (1))) .toEqual (1)
})

test ('curry', () => {
  expect (curry (p => fst (p) + snd (p)) (2) (3)) .toEqual (5)
})

test ('uncurry', () => {
  expect (uncurry (a => b => a + b) (fromBinary (2, 3))) .toEqual (5)
})

test ('swap', () => {
  expect (swap (fromBoth (3) (1))) .toEqual (fromBoth (1) (3))
})

// CUSTOM FUNCTIONS

test ('toArray', () => {
  expect (toArray (fromBoth (3) (1))) .toEqual ([3, 1])
})

test ('fromArray', () => {
  expect (fromArray ([3, 1])) .toEqual (fromBoth (3) (1))
})

test ('isPair', () => {
  expect (isPair (fromBoth (3) (1))) .toEqual (true)
  expect (isPair (2)) .toEqual (false)
})
