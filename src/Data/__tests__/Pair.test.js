// @ts-check
const { Pair, bimap, first, second, fst, snd, curry, uncurry, swap, toArray, fromArray, isPair } = require('../Pair')

// CONSTRUCTOR

test ('Pair (x) (y)', () => {
  const pair = Pair (3) (1)
  expect (pair .first) .toEqual (3)
  expect (pair .second) .toEqual (1)
  expect (pair .isPair) .toEqual (true)
})

test ('Pair (x, y)', () => {
  const pair = Pair (3, 1)
  expect (pair .first) .toEqual (3)
  expect (pair .second) .toEqual (1)
  expect (pair .isPair) .toEqual (true)
})

// BIFUNCTOR

test ('bimap', () => {
  expect (bimap (a => a + 2) (b => b + 3) (Pair (3) (1)))
    .toEqual (Pair (5) (4))
})

test ('first', () => {
  expect (first (a => a + 2) (Pair (3) (1))) .toEqual (Pair (5) (1))
})

test ('second', () => {
  expect (second (b => b + 3) (Pair (3) (1))) .toEqual (Pair (3) (4))
})

// PAIR FUNCTIONS

test ('fst', () => {
  expect (fst (Pair (3) (1))) .toEqual (3)
})

test ('snd', () => {
  expect (snd (Pair (3) (1))) .toEqual (1)
})

test ('curry', () => {
  expect (curry (p => fst (p) + snd (p)) (2) (3)) .toEqual (5)
})

test ('uncurry', () => {
  expect (uncurry (a => b => a + b) (Pair (2, 3))) .toEqual (5)
})

test ('swap', () => {
  expect (swap (Pair (3) (1))) .toEqual (Pair (1) (3))
})

// CUSTOM FUNCTIONS

test ('toArray', () => {
  expect (toArray (Pair (3) (1))) .toEqual ([3, 1])
})

test ('fromArray', () => {
  expect (fromArray ([3, 1])) .toEqual (Pair (3) (1))
})

test ('isPair', () => {
  expect (isPair (Pair (3) (1))) .toEqual (true)
  expect (isPair (2)) .toEqual (false)
})
