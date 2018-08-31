const { Tuple } = require('../tuple');

test('construct a Tuple', () => {
  const tuple = Tuple.of (3) (1);
  expect(tuple.first).toEqual(3);
  expect(tuple.second).toEqual(1);
});

test('fmap', () => {
  expect(Tuple.of(3)(1).fmap(x => x * 2)).toEqual(Tuple.of(3)(2));
});

test('map', () => {
  expect(Tuple.of(3)(1).map(x => x * 2)).toEqual(Tuple.of(3)(2));
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
