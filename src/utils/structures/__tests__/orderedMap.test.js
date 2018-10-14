const { List } = require('../list');
const { Just, Nothing } = require('../maybe');
const { OrderedMap } = require('../orderedMap');
const { OrderedSet } = require('../orderedSet');
const { Tuple } = require('../tuple');

test('construct an OrderedMap', () => {
  expect(OrderedMap.of(new Map([[1, 'a'],[2, 'b'], [3, 'c']])).value)
    .toEqual(new Map([[1, 'a'],[2, 'b'], [3, 'c']]));
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).value)
    .toEqual(new Map([[1, 'a'],[2, 'b'], [3, 'c']]));
  expect(OrderedMap.of().value)
    .toEqual(new Map());
});

test('Symbol.iterator', () => {
  expect([...OrderedMap.of(new Map([[1, 'a'],[2, 'b'], [3, 'c']]))])
    .toEqual([[1, 'a'],[2, 'b'], [3, 'c']]);
});

test('null', () => {
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).null())
    .toBeFalsy();
  expect(OrderedMap.of().null())
    .toBeTruthy();
});

test('size', () => {
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).size())
    .toEqual(3);
  expect(OrderedMap.of().size())
    .toEqual(0);
});

test('OrderedMap.size', () => {
  expect(OrderedMap.size (OrderedMap.of ([[1, 'a'],[2, 'b'], [3, 'c']])))
    .toEqual(3);
  expect(OrderedMap.size (OrderedMap.of ()))
    .toEqual(0);
});

test('member', () => {
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).member(2))
    .toBeTruthy();
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).member(5))
    .toBeFalsy();
});

test('OrderedMap.member', () => {
  expect(OrderedMap.member (2) (OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']])))
    .toBeTruthy();
  expect(OrderedMap.member (5) (OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']])))
    .toBeFalsy();
});

test('notMember', () => {
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).notMember(2))
    .toBeFalsy();
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).notMember(5))
    .toBeTruthy();
});

test('lookup', () => {
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).lookup(2))
    .toEqual(Just('b'));
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).lookup(5))
    .toEqual(Nothing());
});

test('OrderedMap.lookup', () => {
  expect(OrderedMap.lookup (2) (OrderedMap.of ([[1, 'a'],[2, 'b'], [3, 'c']])))
    .toEqual(Just ('b'));
  expect(OrderedMap.lookup (5) (OrderedMap.of ([[1, 'a'],[2, 'b'], [3, 'c']])))
    .toEqual(Nothing ());
});

test('OrderedMap.lookup_', () => {
  expect(OrderedMap.lookup_ (OrderedMap.of ([[1, 'a'],[2, 'b'], [3, 'c']])) (2))
    .toEqual(Just ('b'));
  expect(OrderedMap.lookup_ (OrderedMap.of ([[1, 'a'],[2, 'b'], [3, 'c']])) (5))
    .toEqual(Nothing ());
});

test('findWithDefault', () => {
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).findWithDefault('...')(2))
    .toEqual('b');
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).findWithDefault('...')(5))
    .toEqual('...');
});

test('insert', () => {
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).insert(4)('d'))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c'], [4, 'd']]));
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).insert(3)('d'))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'd']]));
});

test('OrderedMap.insert', () => {
  expect(OrderedMap.insert (4) ('d') (OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']])))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c'], [4, 'd']]));
  expect(OrderedMap.insert (3) ('d') (OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']])))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'd']]));
});

test('insertWith', () => {
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).insertWith(old => x => old + x)(4)('d'))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c'], [4, 'd']]));
  expect(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]).insertWith(old => x => old + x)(3)('d'))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'cd']]));
});

test('insertWithKey', () => {
  expect(
    OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']])
      .insertWithKey(key => old => x => old + x + key)(4)('d')
  )
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c'], [4, 'd']]));
  expect(
    OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']])
      .insertWithKey(key => old => x => old + x + key)(3)('d')
  )
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'cd3']]));
});

test('insertLookupWithKey', () => {
  expect(
    OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']])
      .insertLookupWithKey(key => old => x => old + x + key)(4)('d')
  )
    .toEqual(
      Tuple.of(
        Nothing()
      )(
        OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c'], [4, 'd']])
      )
    );

  expect(
    OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']])
      .insertLookupWithKey(key => old => x => old + x + key)(3)('d')
  )
    .toEqual(
      Tuple.of(
        Just('c')
      )(
        OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'cd3']])
      )
    );
});

test('delete', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]);

  expect(map.delete(3))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b']]));

  expect(map.delete(4) === map)
    .toBeTruthy();
});

test('OrderedMap.delete', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'], [3, 'c']]);

  expect(OrderedMap.delete (3) (map))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b']]));

  expect(OrderedMap.delete (4) (map) === map)
    .toBeTruthy();
});

test('adjust', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);

  expect(map.adjust(x => x + 'd')(3))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'cd']]));

  expect(map.adjust(x => x + 'd')(4) === map)
    .toBeTruthy();
});

test('adjustWithKey', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);

  expect(map.adjustWithKey(key => x => x + key)(3))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c3']]));

  expect(map.adjustWithKey(key => x => x + key)(4) === map)
    .toBeTruthy();
});

test('update', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);

  expect(map.update(x => Just(x + 'd'))(3))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'cd']]));

  expect(map.update(x => Nothing())(3))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b']]));

  expect(map.update(x => Just(x + 'd'))(4) === map)
    .toBeTruthy();

  expect(map.update(x => Nothing())(4) === map)
    .toBeTruthy();
});

test('updateWithKey', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);

  expect(map.updateWithKey(key => x => Just(x + key))(3))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c3']]));

  expect(map.updateWithKey(key => x => Nothing())(3))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b']]));

  expect(map.updateWithKey(key => x => Just(x + key))(4) === map)
    .toBeTruthy();

  expect(map.updateWithKey(key => x => Nothing())(4) === map)
    .toBeTruthy();
});

test('updateLookupWithKey', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);

  expect(map.updateLookupWithKey(key => x => Just(x + key))(3))
    .toEqual(Tuple.of(Just('c3'))(OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c3']])));

  expect(map.updateLookupWithKey(key => x => Nothing())(3))
    .toEqual(Tuple.of(Just('c'))(OrderedMap.of([[1, 'a'],[2, 'b']])));

  expect(Tuple.snd(map.updateLookupWithKey(key => x => Just(x + key))(4)) === map)
    .toBeTruthy();

  expect(Tuple.snd(map.updateLookupWithKey(key => x => Nothing())(4)) === map)
    .toBeTruthy();
});

test('alter', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);

  // Update
  expect(map.alter(m => m.fmap(x => x + 'd'))(3))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'cd']]));

  // Insert
  expect(map.alter(m => m.fmap(x => x).alt(Just('d')))(4))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c'],[4, 'd']]));

  // Delete
  expect(map.alter(m => Nothing())(3))
    .toEqual(OrderedMap.of([[1, 'a'],[2, 'b']]));
});

test('union', () => {
  const map1 = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);
  const map2 = OrderedMap.of([[3, 'd'],[4, 'e'],[5, 'f']]);
  const res = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c'],[4, 'e'],[5, 'f']]);

  expect(map1.union(map2)).toEqual(res);
});

test('fmap', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);
  const res = OrderedMap.of([[1, 'a_'],[2, 'b_'],[3, 'c_']]);

  expect(map.fmap(x => x + '_')).toEqual(res);
});

test('map', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);
  const res = OrderedMap.of([[1, 'a_'],[2, 'b_'],[3, 'c_']]);

  expect(map.map(x => x + '_')).toEqual(res);
});

test('OrderedMap.map', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);
  const res = OrderedMap.of([[1, 'a_'],[2, 'b_'],[3, 'c_']]);

  expect(OrderedMap.map (x => x + '_') (map)).toEqual(res);
});

test('mapWithKey', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);
  const res = OrderedMap.of([[1, 'a1'],[2, 'b2'],[3, 'c3']]);

  expect(map.mapWithKey(key => x => x + key)).toEqual(res);
});

test('foldl', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);
  const res = 'abc';

  expect(map.foldl(acc => x => acc + x)('')).toEqual(res);
});

test('OrderedMap.foldl', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);
  const res = 'abc';

  expect(OrderedMap.foldl (acc => x => acc + x) ('') (map)).toEqual(res);
});

test('foldlWithKey', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);
  const res = 'a1b2c3';

  expect(map.foldlWithKey(acc => key => x => acc + x + key)('')).toEqual(res);
});

test('foldr', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);
  const res = 'cba';

  expect(map.foldr(acc => x => acc + x)('')).toEqual(res);
});

test('OrderedMap.foldr', () => {
  const map = OrderedMap.of([[1, 'a'],[2, 'b'],[3, 'c']]);
  const res = 'cba';

  expect(OrderedMap.foldr (acc => x => acc + x) ('') (map)).toEqual(res);
});

test('elems', () => {
  const map = OrderedMap.of([[1, 'a'],[3, 'c'],[2, 'b']]);
  const res = List.of('a', 'c', 'b');

  expect(map.elems()).toEqual(res);
});

test('keys', () => {
  const map = OrderedMap.of([[1, 'a'],[3, 'c'],[2, 'b']]);
  const res = List.of(1, 3, 2);

  expect(map.keys()).toEqual(res);
});

test('assocs', () => {
  const map = OrderedMap.of([[1, 'a'],[3, 'c'],[2, 'b']]);
  const res = List.of(Tuple.of(1)('a'), Tuple.of(3)('c'), Tuple.of(2)('b'));

  expect(map.assocs()).toEqual(res);
});

test('keysSet', () => {
  const map = OrderedMap.of([[1, 'a'],[3, 'c'],[2, 'b']]);
  const res = OrderedSet.of([1, 3, 2]);

  expect(map.keysSet()).toEqual(res);
});

test('OrderedMap.fromSet', () => {
  const map = OrderedSet.of([1, 3, 2]);
  const res = OrderedMap.of([[1, 2],[3, 6],[2, 4]]);

  expect(OrderedMap.fromSet(key => key * 2)(map)).toEqual(res);
});

test('toList', () => {
  const map = OrderedMap.of([[1, 'a'],[3, 'c'],[2, 'b']]);
  const res = List.of(Tuple.of(1)('a'), Tuple.of(3)('c'), Tuple.of(2)('b'));

  expect(map.toList()).toEqual(res);
});

test('OrderedMap.fromList', () => {
  const map = List.of(Tuple.of(1)('a'), Tuple.of(3)('c'), Tuple.of(2)('b'));
  const res = OrderedMap.of([[1, 'a'],[3, 'c'],[2, 'b']]);

  expect(OrderedMap.fromList(map)).toEqual(res);
});

test('filter', () => {
  const map = OrderedMap.of([[1, 'a'],[3, 'c'],[4, 'd'],[2, 'b']]);
  const res = OrderedMap.of([[4, 'd'],[2, 'b']]);

  expect(map.filter(e => e === 'b' || e === 'd')).toEqual(res);
});

test('filterWithKey', () => {
  const map = OrderedMap.of([[1, 'a'],[3, 'c'],[4, 'd'],[2, 'b']]);
  const res = OrderedMap.of([[3, 'c'],[4, 'd'],[2, 'b']]);

  expect(map.filterWithKey(key => e => key % 2 === 0 || e === 'c')).toEqual(res);
});

test('mapMaybe', () => {
  const map = OrderedMap.of([[1, 'a'],[3, 'c'],[4, 'd'],[2, 'b']]);
  const res = OrderedMap.of([[4, '+'],[2, '+']]);

  expect(map.mapMaybe(e => (e === 'b' || e === 'd') ? Just('+') : Nothing())).toEqual(res);
});

test('mapMaybeWithKey', () => {
  const map = OrderedMap.of([[1, 'a'],[3, 'c'],[4, 'd'],[2, 'b']]);
  const res = OrderedMap.of([[3, '+'],[4, '+'],[2, '+']]);

  expect(map.mapMaybeWithKey(key => e => (key % 2 === 0 || e === 'c') ? Just('+') : Nothing())).toEqual(res);
});

test('toKeyValueObjectWith', () => {
  const map = OrderedMap.of([[1, 'a'],[3, 'c'],[2, 'b']]);
  const res = { 1: '<a>', 2: '<b>', 3: '<c>' };

  expect(map.toKeyValueObjectWith(e => `<${e}>`)).toEqual(res);
});

test('toMap', () => {
  const map = OrderedMap.of([[1, 'a'],[3, 'c'],[2, 'b']]);
  const res = new Map([[1, 'a'],[3, 'c'],[2, 'b']]);

  expect(map.toMap()).toEqual(res);
});

test('OrderedMap.empty', () => {
  const map = OrderedMap.empty();
  const res = OrderedMap.of([]);

  expect(map).toEqual(res);
});

test('OrderedMap.singleton', () => {
  const res = OrderedMap.of([[1, 'a']]);

  expect(OrderedMap.singleton(1)('a')).toEqual(res);
});

test('OrderedMap.toList', () => {
  const map = OrderedMap.of([[1, 'a'],[3, 'c'],[2, 'b']]);
  const res = List.of(Tuple.of(1)('a'), Tuple.of(3)('c'), Tuple.of(2)('b'));

  expect(OrderedMap.toList(map)).toEqual(res);
});

test('OrderedMap.elems', () => {
  const map = OrderedMap.of([[1, 'a'],[3, 'c'],[2, 'b']]);
  const res = List.of('a', 'c', 'b');

  expect(OrderedMap.elems(map)).toEqual(res);
});
