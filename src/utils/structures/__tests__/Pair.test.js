const { fromBoth, fmap, mapReplace, bimap, first, second, fst, snd, swap, toArray, isPair } = require('../Pair');

// CONSTRUCTOR

test('construct a Pair', () => {
  const pair = fromBoth (3) (1);
  expect (pair .first) .toEqual (3);
  expect (pair .second) .toEqual (1);
  expect (pair .isPair) .toEqual (true);
});

// FUNCTOR

test('fmap', () => {
  expect (fmap (x => x * 2) (fromBoth (3) (1))) .toEqual (fromBoth (3) (2));
});

test('mapReplace', () => {
  expect (mapReplace (4) (fromBoth (3) (1))) .toEqual (fromBoth (3) (4));
});

// BIFUNCTOR

test('bimap', () => {
  expect (bimap (a => a + 2) (b => b + 3) (fromBoth (3) (1)))
    .toEqual (fromBoth (5) (4));
});

test('first', () => {
  expect (first (a => a + 2) (fromBoth (3) (1))) .toEqual (fromBoth (5) (1));
});

test('second', () => {
  expect (second (b => b + 3) (fromBoth (3) (1))) .toEqual (fromBoth (3) (4));
});

// PAIR FUNCTIONS

test('fst', () => {
  expect (fst (fromBoth (3) (1))) .toEqual (3);
});

test('snd', () => {
  expect (snd (fromBoth (3) (1))) .toEqual (1);
});

test('swap', () => {
  expect (swap (fromBoth (3) (1))) .toEqual (fromBoth (1) (3));
});

// CUSTOM FUNCTIONS

test('toArray', () => {
  expect (toArray (fromBoth (3) (1))) .toEqual ([3, 1]);
});

test('isPair', () => {
  expect (isPair (fromBoth (3) (1))) .toEqual (true);
  expect (isPair (2)) .toEqual (false);
});
