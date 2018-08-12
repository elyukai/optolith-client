const { List } = require('../list');
const { OrderedSet } = require('../orderedSet');

test('construct an OrderedSet', () => {
  expect(OrderedSet.of(new Set([1, 2, 3])).value)
    .toEqual(new Set([1, 2, 3]));
  expect(OrderedSet.of(List.of(1, 2, 3)).value)
    .toEqual(new Set([1, 2, 3]));
  expect(OrderedSet.of([1, 2, 3]).value)
    .toEqual(new Set([1, 2, 3]));
  expect(OrderedSet.of().value)
    .toEqual(new Set());
});

test('Symbol.iterator', () => {
  expect([...OrderedSet.of(['a', 'b', 'c'])])
    .toEqual(['a', 'b', 'c']);
});

test('null', () => {
  expect(OrderedSet.of(['a', 'b', 'c']).null())
    .toBeFalsy();
  expect(OrderedSet.of([]).null())
    .toBeTruthy();
});

test('size', () => {
  expect(OrderedSet.of(['a', 'b', 'c']).size())
    .toEqual(3);
  expect(OrderedSet.of([]).size())
    .toEqual(0);
});

test('member', () => {
  expect(OrderedSet.of(['a', 'b', 'c']).member('b'))
    .toBeTruthy();
  expect(OrderedSet.of([]).member('d'))
    .toBeFalsy();
});

test('notMember', () => {
  expect(OrderedSet.of(['a', 'b', 'c']).notMember('b'))
    .toBeFalsy();
  expect(OrderedSet.of([]).notMember('d'))
    .toBeTruthy();
});

test('insert', () => {
  expect(OrderedSet.of(['a', 'b', 'c']).insert('d'))
    .toEqual(OrderedSet.of(['a', 'b', 'c', 'd']));
});

test('delete', () => {
  expect(OrderedSet.of(['a', 'b', 'c']).delete('c'))
    .toEqual(OrderedSet.of(['a', 'b']));
  expect(OrderedSet.of(['a', 'b', 'c']).delete('d'))
    .toEqual(OrderedSet.of(['a', 'b', 'c']));
});

test('union', () => {
  expect(OrderedSet.of(['a', 'b', 'c']).union(OrderedSet.of(['c', 'd', 'e'])))
    .toEqual(OrderedSet.of(['a', 'b', 'c', 'd', 'e']));
});

test('filter', () => {
  expect(OrderedSet.of(['a', 'b', 'c']).filter(e => e > 'a'))
    .toEqual(OrderedSet.of(['b', 'c']));
});

test('fmap', () => {
  expect(OrderedSet.of(['a', 'b', 'c']).fmap(e => e + '+'))
    .toEqual(OrderedSet.of(['a+', 'b+', 'c+']));
});

test('map', () => {
  expect(OrderedSet.of(['a', 'b', 'c']).map(e => e + '+'))
    .toEqual(OrderedSet.of(['a+', 'b+', 'c+']));
});

test('foldl', () => {
  expect(OrderedSet.of(['a', 'b', 'c']).foldl(acc => e => acc + e, ''))
    .toEqual('abc');
  expect(OrderedSet.of(['a', 'b', 'c']).foldl(acc => e => acc + e)(''))
    .toEqual('abc');
});

test('toSet', () => {
  expect(OrderedSet.of(['a', 'b', 'c']).toSet())
    .toEqual(new Set(['a', 'b', 'c']));
});

test('elems', () => {
  expect(OrderedSet.of(['a', 'b', 'c']).elems())
    .toEqual(List.of('a', 'b', 'c'));
});

test('OrderedSet.empty', () => {
  expect(OrderedSet.empty())
    .toEqual(OrderedSet.of([]));
});

test('OrderedSet.singleton', () => {
  expect(OrderedSet.singleton('a'))
    .toEqual(OrderedSet.of(['a']));
});
