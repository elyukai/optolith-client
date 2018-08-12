const { List } = require('../list');
const { Just, Nothing } = require('../maybe');
const { OrderedMap } = require('../orderedMap');
const { Tuple } = require('../tuple');

test('List.of', () => {
  expect(List.of(3, 2, 1).value).toEqual([3, 2, 1]);
});

test('Symbol.iterator', () => {
  expect(List.of(...List.of(3, 2, 1))).toEqual(List.of(3, 2, 1));
});

test('concat', () => {
  expect(List.of(3, 2, 1).concat(List.of(3, 2, 1))).toEqual(List.of(3, 2, 1, 3, 2, 1));
});

test('prepend', () => {
  expect(List.of(3, 2, 1).prepend(4)).toEqual(List.of(4, 3, 2, 1));
});

test('subscript', () => {
  expect(List.of(3, 2, 1).subscript(2)).toEqual(Just(1));
  expect(List.of(3, 2, 1).subscript(4)).toEqual(Nothing());
  expect(List.of(3, 2, 1).subscript(-1)).toEqual(Nothing());
});

test('head', () => {
  expect(List.of(3, 2, 1).head()).toEqual(Just(3));
  expect(List.of().head()).toEqual(Nothing());
});

test('last', () => {
  expect(List.of(3, 2, 1).last()).toEqual(Just(1));
  expect(List.of().last()).toEqual(Nothing());
});

test('tail', () => {
  expect(List.of(3, 2, 1).tail()).toEqual(List.of(2, 1));
  expect(List.of(1).tail()).toEqual(List.of());
  expect(List.of().tail()).toEqual(List.of());
});

test('init', () => {
  expect(List.of(3, 2, 1).init()).toEqual(List.of(3, 2));
  expect(List.of(1).init()).toEqual(List.of());
  expect(List.of().init()).toEqual(List.of());
});

test('uncons', () => {
  expect(List.of(3, 2, 1).uncons()).toEqual(Just(Tuple.of(3, List.of(2, 1))));
  expect(List.of(1).uncons()).toEqual(Just(Tuple.of(1, List.of())));
  expect(List.of().uncons()).toEqual(Nothing());
});

test('null', () => {
  expect(List.of(3, 2, 1).null()).toBeFalsy();
  expect(List.of().null()).toBeTruthy();
});

test('length', () => {
  expect(List.of(3, 2, 1).length()).toEqual(3);
  expect(List.of().length()).toEqual(0);
});

test('fmap', () => {
  expect(List.of(3, 2, 1).fmap(x => x * 2)).toEqual(List.of(6, 4, 2));
});

test('map', () => {
  expect(List.of(3, 2, 1).map(x => x * 2)).toEqual(List.of(6, 4, 2));
});

test('imap', () => {
  expect(List.of(3, 2, 1).imap(i => x => x * 2 + i)).toEqual(List.of(6, 5, 4));
});

test('reverse', () => {
  expect(List.of(3, 2, 1).reverse())
    .toEqual(List.of(1, 2, 3));

  const original = List.of(3, 2, 1);
  const result = original.reverse();
  expect(original === result).toBeFalsy();
});

test('intercalate', () => {
  expect(List.of(3, 2, 1).intercalate(', '))
    .toEqual('3, 2, 1');
});

test('foldl', () => {
  expect(List.of(3, 2, 1).foldl(acc => x => acc + x, 0))
    .toEqual(6);
  expect(List.of(3, 2, 1).foldl(acc => x => acc + x)(0))
    .toEqual(6);
});

test('ifoldl', () => {
  expect(List.of(3, 2, 1).ifoldl(acc => i => x => acc + x + i, 0))
    .toEqual(9);
  expect(List.of(3, 2, 1).ifoldl(acc => i => x => acc + x + i)(0))
    .toEqual(9);
});

test('ifoldlWithList', () => {
  expect(List.of(3, 2, 1).ifoldlWithList(list => acc => i => x => acc + x + i + list.length(), 0))
    .toEqual(18);
  expect(List.of(3, 2, 1).ifoldlWithList(list => acc => i => x => acc + x + i + list.length())(0))
    .toEqual(18);
});

test('concatInner', () => {
  expect(List.of(List.of(3), List.of(2), List.of(1)).concatInner())
    .toEqual(List.of(3, 2, 1));
});

test('and', () => {
  expect(List.of(true, true, true).and())
    .toBeTruthy();
  expect(List.of(true, true, false).and())
    .toBeFalsy();
  expect(List.of(true, false, true).and())
    .toBeFalsy();
});

test('or', () => {
  expect(List.of(true, true, true).or())
    .toBeTruthy();
  expect(List.of(true, true, false).or())
    .toBeTruthy();
  expect(List.of(false, false, false).or())
    .toBeFalsy();
});

test('any', () => {
  expect(List.of(3, 2, 1).any(x => x > 2))
    .toBeTruthy();
  expect(List.of(3, 2, 1).any(x => x > 3))
    .toBeFalsy();
});

test('iany', () => {
  expect(List.of(3, 2, 1).iany(i => x => x > 2 && i < 5))
    .toBeTruthy();
  expect(List.of(3, 2, 1).iany(i => x => x > 3 && i < 5))
    .toBeFalsy();
  expect(List.of(3, 2, 1).iany(i => x => x > 2 && i > 0))
    .toBeFalsy();
});

test('all', () => {
  expect(List.of(3, 2, 1).all(x => x >= 1))
    .toBeTruthy();
  expect(List.of(3, 2, 1).all(x => x >= 2))
    .toBeFalsy();
});

test('iall', () => {
  expect(List.of(3, 2, 1).iall(i => x => x >= 1 && i < 5))
    .toBeTruthy();
  expect(List.of(3, 2, 1).iall(i => x => x >= 2 && i < 5))
    .toBeFalsy();
  expect(List.of(3, 2, 1).iall(i => x => x >= 1 && i > 0))
    .toBeFalsy();
});

test('sum', () => {
  expect(List.of(3, 2, 1).sum())
    .toEqual(6);
});

test('product', () => {
  expect(List.of(3, 2, 2).product())
    .toEqual(12);
});

test('maximum', () => {
  expect(List.of(3, 2, 1).maximum())
    .toEqual(3);
  expect(List.of().maximum())
    .toEqual(-Infinity);
});

test('minimum', () => {
  expect(List.of(3, 2, 1).minimum())
    .toEqual(1);
  expect(List.of().minimum())
    .toEqual(Infinity);
});

test('scanl', () => {
  expect(List.of(2, 3, 4).scanl(acc => x => acc * x, 1))
    .toEqual(List.of(1, 2, 6, 24));
});

test('take', () => {
  expect(List.of(1, 2, 3, 4, 5).take(3))
    .toEqual(List.of(1, 2, 3));
  expect(List.of(1, 2, 3, 4, 5).take(6))
    .toEqual(List.of(1, 2, 3, 4, 5));
});

test('elem', () => {
  expect(List.of(1, 2, 3, 4, 5).elem(3))
    .toBeTruthy();
  expect(List.of(1, 2, 3, 4, 5).elem(6))
    .toBeFalsy();
});

test('notElem', () => {
  expect(List.of(1, 2, 3, 4, 5).notElem(3))
    .toBeFalsy();
  expect(List.of(1, 2, 3, 4, 5).notElem(6))
    .toBeTruthy();
});

test('lookup', () => {
  expect(List.of(Tuple.of(1, 'a'), Tuple.of(2, 'b')).lookup(1))
    .toEqual(Just('a'));
  expect(List.of(Tuple.of(1, 'a'), Tuple.of(2, 'b')).lookup(3))
    .toEqual(Nothing());
});

test('find', () => {
  expect(List.of('one', 'two', 'three').find(e => /t/.test(e)))
    .toEqual(Just('two'));
  expect(List.of('one', 'two', 'three').find(e => /tr/.test(e)))
    .toEqual(Nothing());
});

test('ifind', () => {
  expect(List.of('one', 'two', 'three').ifind(i => e => /t/.test(e) || i === 2))
    .toEqual(Just('two'));
  expect(List.of('one', 'two', 'three').ifind(i => e => /tr/.test(e) || i === 2))
    .toEqual(Just('three'));
  expect(List.of('one', 'two', 'three').ifind(i => e => /tr/.test(e) || i === 5))
    .toEqual(Nothing());
});

test('filter', () => {
  expect(List.of(1, 2, 3, 4, 5).filter(x => x > 2))
    .toEqual(List.of(3, 4, 5));
});

test('ifilter', () => {
  expect(List.of(1, 2, 3, 4, 5).ifilter(i => x => x > 2 || i === 0))
    .toEqual(List.of(1, 3, 4, 5));
});

test('partition', () => {
  expect(List.of(1, 2, 3, 4, 5).partition(x => x > 2))
    .toEqual(Tuple.of(List.of(3, 4, 5), List.of(1, 2)));
});

test('ipartition', () => {
  expect(List.of(1, 2, 3, 4, 5).ipartition(i => x => x > 2 || i === 0))
    .toEqual(Tuple.of(List.of(1, 3, 4, 5), List.of(2)));
});

test('elemIndex', () => {
  expect(List.of(1, 2, 3, 4, 5).elemIndex(3))
    .toEqual(Just(2));
  expect(List.of(1, 2, 3, 4, 5).elemIndex(8))
    .toEqual(Nothing());
});

test('elemIndices', () => {
  expect(List.of(1, 2, 3, 4, 5, 3).elemIndices(3))
    .toEqual(List.of(2, 5));
  expect(List.of(1, 2, 3, 4, 5, 3).elemIndices(4))
    .toEqual(List.of(3));
  expect(List.of(1, 2, 3, 4, 5, 3).elemIndices(8))
    .toEqual(List.of());
});

test('findIndex', () => {
  expect(List.of(1, 2, 3, 4, 5).findIndex(x => x > 2))
    .toEqual(Just(2));
  expect(List.of(1, 2, 3, 4, 5).findIndex(x => x > 8))
    .toEqual(Nothing());
});

test('ifindIndex', () => {
  expect(List.of(1, 2, 3, 4, 5).ifindIndex(i => x => x > 2 && i > 2))
    .toEqual(Just(3));
  expect(List.of(1, 2, 3, 4, 5).ifindIndex(i => x => x > 8 && i > 2))
    .toEqual(Nothing());
});

test('findIndices', () => {
  expect(List.of(1, 2, 3, 4, 5, 3).findIndices(x => x === 3))
    .toEqual(List.of(2, 5));
  expect(List.of(1, 2, 3, 4, 5, 3).findIndices(x => x > 3))
    .toEqual(List.of(3, 4));
  expect(List.of(1, 2, 3, 4, 5, 3).findIndices(x => x > 8))
    .toEqual(List.of());
});

test('ifindIndices', () => {
  expect(List.of(1, 2, 3, 4, 5, 3).ifindIndices(i => x => x === 3 && i > 2))
    .toEqual(List.of(5));
  expect(List.of(1, 2, 3, 4, 5, 3).ifindIndices(i => x => x > 4 && i > 3))
    .toEqual(List.of(4));
  expect(List.of(1, 2, 3, 4, 5, 3).ifindIndices(i => x => x > 8 && i > 2))
    .toEqual(List.of());
});

test('delete', () => {
  expect(List.of(1, 2, 3, 4, 5).delete(3))
    .toEqual(List.of(1, 2, 4, 5));
  expect(List.of(1, 2, 3, 4, 5).delete(6))
    .toEqual(List.of(1, 2, 3, 4, 5));
});

test('sortBy', () => {
  expect(List.of(2, 3, 1, 5, 4).sortBy(a => b => a - b))
    .toEqual(List.of(1, 2, 3, 4, 5));
});

test('deleteAt', () => {
  expect(List.of(1, 2, 3, 4, 5).deleteAt(1))
    .toEqual(List.of(1, 3, 4, 5));
});

test('setAt', () => {
  expect(List.of(1, 2, 3, 4, 5).setAt(2, 4))
    .toEqual(List.of(1, 2, 4, 4, 5));
});

test('modifyAt', () => {
  expect(List.of(1, 2, 3, 4, 5).modifyAt(2, x => x * 3))
    .toEqual(List.of(1, 2, 9, 4, 5));
});

test('updateAt', () => {
  expect(List.of(1, 2, 3, 4, 5).updateAt(2, x => Just(x * 3)))
    .toEqual(List.of(1, 2, 9, 4, 5));
  expect(List.of(1, 2, 3, 4, 5).updateAt(2, x => Nothing()))
    .toEqual(List.of(1, 2, 4, 5));
});

test('insertAt', () => {
  expect(List.of(1, 2, 3, 4, 5).insertAt(2, 6))
    .toEqual(List.of(1, 2, 6, 3, 4, 5));
});

test('append', () => {
  expect(List.of(1, 2, 3, 4, 5).append(6))
    .toEqual(List.of(1, 2, 3, 4, 5, 6));
});

test('toArray', () => {
  expect(List.of(1, 2, 3, 4, 5).toArray())
    .toEqual([1, 2, 3, 4, 5]);
});

test('List.find', () => {
  expect(List.find(e => /t/.test(e))(List.of('one', 'two', 'three')))
    .toEqual(Just('two'));
  expect(List.find(e => /tr/.test(e))(List.of('one', 'two', 'three')))
    .toEqual(Nothing());
});

test('List.filter', () => {
  expect(List.filter(x => x > 2)(List.of(1, 2, 3, 4, 5)))
    .toEqual(List.of(3, 4, 5));
});

test('List.toMap', () => {
  expect(List.toMap(List.of(Tuple.of(1, 'a'), Tuple.of(2, 'b'), Tuple.of(3, 'c'))))
    .toEqual(OrderedMap.of([[1, 'a'], [2, 'b'], [3, 'c']]));
});

test('List.toArray', () => {
  expect(List.toArray(List.of(1, 2, 3, 4, 5)))
    .toEqual([1, 2, 3, 4, 5]);
});

test('List.fromArray', () => {
  expect(List.fromArray([1, 2, 3, 4, 5]))
    .toEqual(List.of(1, 2, 3, 4, 5));
});

test('List.isList', () => {
  expect(List.isList(List.of(1, 2, 3, 4, 5)))
    .toBeTruthy();
  expect(List.isList(4))
    .toBeFalsy();
});

test('List.map', () => {
  expect(List.map(x => x * 2, List.of(3, 2, 1))).toEqual(List.of(6, 4, 2));
  expect(List.map(x => x * 2)(List.of(3, 2, 1))).toEqual(List.of(6, 4, 2));
});

test('List.maximum', () => {
  expect(List.maximum(List.of(3, 2, 1)))
    .toEqual(3);
  expect(List.maximum(List.of()))
    .toEqual(-Infinity);
});

test('List.unfoldr', () => {
  expect(List.unfoldr(x => x < 11 ? Just(Tuple.of(x, x + 1)) : Nothing(), 1))
    .toEqual(List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
  expect(List.unfoldr(x => x < 11 ? Just(Tuple.of(x, x + 1)) : Nothing())(1))
    .toEqual(List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
});
