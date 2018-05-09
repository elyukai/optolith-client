const CollectionUtils = require('../collectionUtils');
const { pipe } = require('../pipe');

test('adds element to array', () => {
  expect(CollectionUtils.addToArray([1, 2, 3])(4))
    .toEqual([1, 2, 3, 4]);
});

test('adds element to array in reverse function order', () => {
  expect(CollectionUtils.addToPipedArray(4)([1, 2, 3]))
    .toEqual([1, 2, 3, 4]);
});

test('updates element of array', () => {
  expect(CollectionUtils.updateArrayItem([1, 2, 3])(2, 4))
    .toEqual([1, 2, 4]);
});

test('does not update array when index not in array', () => {
  expect(CollectionUtils.updateArrayItem([1, 2, 3])(3, 4))
    .toEqual([1, 2, 3]);
});

test('updates element of array in reverse function order', () => {
  expect(CollectionUtils.updatePipedArrayItem(2, 4)([1, 2, 3]))
    .toEqual([1, 2, 4]);
});

test('does not update piped array when index not in array', () => {
  expect(CollectionUtils.updatePipedArrayItem(3, 4)([1, 2, 3]))
    .toEqual([1, 2, 3]);
});

test('removes element from array', () => {
  expect(CollectionUtils.removeFromArray([1, 2, 3])(1))
    .toEqual([1, 3]);
});

test('removes element from array in reverse function order', () => {
  expect(CollectionUtils.removeFromPipedArray(2)([1, 2, 3]))
    .toEqual([1, 2]);
});

test('removes undefined from array', () => {
  expect(CollectionUtils.filterExisting([
    1,
    undefined,
    2,
    3,
    undefined,
    undefined,
    4,
  ]))
    .toEqual([
      1,
      2,
      3,
      4,
    ]);
});

test('converts Map to Array', () => {
  const entries = [['c', 3], ['a', 1], ['b', 2], ['d', 4]];
  const expected = [['c', 3], ['a', 1], ['b', 2], ['d', 4]];
  expect(CollectionUtils.convertMapToArray(new Map(entries)))
    .toEqual(expected);
});

test('converts Map to Array of values', () => {
  const entries = [['b', 2], ['a', 1], ['c', 3], ['d', 4]];
  const expected = [2, 1, 3, 4];
  expect(CollectionUtils.convertMapToValueArray(new Map(entries)))
    .toEqual(expected);
});

test('converts Map to Object', () => {
  const entries = [['c', 3], ['a', 1], ['b', 2], ['d', 4]];
  const expected = {
    a: 1,
    c: 3,
    b: 2,
    d: 4,
  };
  expect(CollectionUtils.convertMapToObject(new Map(entries)))
    .toEqual(expected);
});

test('converts Object to Map', () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  };
  const expected = [['a', 1], ['b', 2], ['c', 3], ['d', 4]];
  expect(pipe(
    CollectionUtils.convertObjectToMap,
    CollectionUtils.convertMapToArray,
  )(obj))
    .toEqual(expected);
});

test('merges Maps', () => {
  const entries = [['c', 3], ['a', 1], ['b', 2], ['d', 4]];
  const entries2 = [['f', 6], ['e', 5]];
  const expected = [['c', 3], ['a', 1], ['b', 2], ['d', 4], ['f', 6], ['e', 5]];
  expect(pipe(
    () => CollectionUtils.mergeMaps(new Map(entries), new Map(entries2)),
    CollectionUtils.convertMapToArray,
  )())
    .toEqual(expected);
});

test('sets Map item', () => {
  const entries = [['c', 3], ['a', 1], ['b', 2], ['d', 4]];
  const expected = [['c', 3], ['a', 1], ['b', 2], ['d', 4], ['f', 6]];
  expect(pipe(
    () => CollectionUtils.setMapItem(new Map(entries), 'f', 6),
    CollectionUtils.convertMapToArray,
  )())
    .toEqual(expected);
});

test('deletes Map item', () => {
  const entries = [['c', 3], ['a', 1], ['b', 2], ['d', 4], ['f', 6]];
  const expected = [['c', 3], ['a', 1], ['b', 2], ['d', 4]];
  expect(pipe(
    () => CollectionUtils.deleteMapItem(new Map(entries), 'f'),
    CollectionUtils.convertMapToArray,
  )())
    .toEqual(expected);
});
