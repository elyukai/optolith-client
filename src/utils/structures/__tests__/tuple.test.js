const { Tuple } = require('../tuple');

test('construct a Tuple', () => {
  const tuple = Tuple.of (3) (1);
  expect(tuple.first).toEqual(3);
  expect(tuple.second).toEqual(1);
});

test('fmap', () => {
  expect(Tuple.of(3)(1).fmap(x => x * 2)).toEqual(Tuple.of(3)(2));
});

test('toArray', () => {
  expect(Tuple.of(3)(1).toArray()).toEqual([3, 1]);
});

test('Tuple.fst', () => {
  expect(Tuple.fst(Tuple.of(3)(1))).toEqual(3);
});

test('Tuple.snd', () => {
  expect(Tuple.snd(Tuple.of(3)(1))).toEqual(1);
});

test('Tuple.swap', () => {
  expect (Tuple.swap (Tuple.of (3) (1))) .toEqual (Tuple.of (1) (3));
});

test('Tuple.bimap', () => {
  expect (Tuple.bimap (a => a + 2) (b => b + 3) (Tuple.of (3) (1))) .toEqual (Tuple.of (5) (4));
});

test('Tuple.first', () => {
  expect (Tuple.first (a => a + 2) (Tuple.of (3) (1))) .toEqual (Tuple.of (5) (1));
});

test('Tuple.second', () => {
  expect (Tuple.second (b => b + 3) (Tuple.of (3) (1))) .toEqual (Tuple.of (3) (4));
});
