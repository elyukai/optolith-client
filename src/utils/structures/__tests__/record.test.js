const { List } = require('../list');
const { Just, Nothing } = require('../maybe');
const { Record } = require('../record');
const { Tuple } = require('../tuple');

test('construct a Record', () => {
  expect(Record.of({ test: 1 }).value).toEqual({ test: 1 });
});

test('member', () => {
  expect(Record.of({ a: 1, b: 2 }).member('a')).toBeTruthy();
  expect(Record.of({ a: 1, b: 2 }).member('c')).toBeFalsy();
});

test('get', () => {
  expect(Record.of({ a: 1, b: 2 }).get('a')).toEqual(1);
});

test('lookup', () => {
  expect(Record.of({ a: 1, b: 2 }).lookup('a')).toEqual(Just(1));
  expect(Record.of({ a: 1, b: 2 }).lookup('c')).toEqual(Nothing());
});

test('Record.lookup', () => {
  expect(Record.lookup ('a') (Record.of({ a: 1, b: 2 }))).toEqual(Just(1));
  expect(Record.lookup ('c') (Record.of({ a: 1, b: 2 }))).toEqual(Nothing());
});

test('lookupWithDefault', () => {
  expect(Record.of({ a: 1, b: 2 }).lookupWithDefault(0)('a')).toEqual(1);
  expect(Record.of({ a: 1, b: 2 }).lookupWithDefault(0)('c')).toEqual(0);
});

test('insert', () => {
  expect(Record.of({ a: 1, b: 2 }).insert('a')(3))
    .toEqual(Record.of({ a: 3, b: 2 }));
  expect(Record.of({ a: 1, b: 2 }).insert('a')(3))
    .toEqual(Record.of({ a: 3, b: 2 }));
});

test('modify', () => {
  expect(Record.of({ a: 1, b: 2 }).modify(x => x * 3)('b'))
    .toEqual(Record.of({ a: 1, b: 6 }));
  expect(Record.of({ a: 1, b: 2 }).modify(x => x * 3)('b'))
    .toEqual(Record.of({ a: 1, b: 6 }));
});

test('update', () => {
  expect(Record.of({ a: 1, b: 2 }).update(x => Just(x * 3))('b'))
    .toEqual(Record.of({ a: 1, b: 6 }));
  expect(Record.of({ a: 1, b: 2 }).update(x => Just(x * 3))('b'))
    .toEqual(Record.of({ a: 1, b: 6 }));

  expect(Record.of({ a: 1, b: 2 }).update(x => Nothing())('b'))
    .toEqual(Record.of({ a: 1 }));
  expect(Record.of({ a: 1, b: 2 }).update(x => Nothing())('b'))
    .toEqual(Record.of({ a: 1 }));
});

test('alter', () => {
  // Modify
  expect(Record.of({ a: 1, b: 2 }).alter(m => m.fmap(x => x * 3))('b'))
    .toEqual(Record.of({ a: 1, b: 6 }));
  expect(Record.of({ a: 1, b: 2 }).alter(m => m.fmap(x => x * 3))('b'))
    .toEqual(Record.of({ a: 1, b: 6 }));

  // Insert
  expect(Record.of({ a: 1, b: 2 }).alter(m => m.fmap(x => x * 3).alt(Just(3)))('c'))
    .toEqual(Record.of({ a: 1, b: 2, c: 3 }));
  expect(Record.of({ a: 1, b: 2 }).alter(m => m.fmap(x => x * 3).alt(Just(3)))('c'))
    .toEqual(Record.of({ a: 1, b: 2, c: 3 }));

  // Delete
  expect(Record.of({ a: 1, b: 2 }).alter(x => Nothing())('b'))
    .toEqual(Record.of({ a: 1 }));
  expect(Record.of({ a: 1, b: 2 }).alter(x => Nothing())('b'))
    .toEqual(Record.of({ a: 1 }));
});

test('delete', () => {
  expect(Record.of({ a: 1, b: 2 }).delete('a'))
    .toEqual(Record.of({ b: 2 }));
});

test('merge', () => {
  expect(Record.of({ a: 1, b: 2 }).merge(Record.of({ a: 2, c: 3 })))
    .toEqual(Record.of({ a: 2, b: 2, c: 3 }));
});

test('mergeMaybe', () => {
  expect(Record.of({ a: 1, b: 2 }).mergeMaybe(Record.of({ a: Nothing(), c: Just(3), d: 4 })))
    .toEqual(Record.of({ b: 2, c: 3, d: 4 }));
});

test('equals', () => {
  expect(Record.of({ a: 1, b: 2 }).equals(Record.of({ a: 1, b: 2 })))
    .toBeTruthy();
  expect(Record.of({ a: 1, b: 2 }).equals(Record.of({ a: 1, c: 2 })))
    .toBeFalsy();
  expect(Record.of({ a: 1, b: 2 }).equals(Record.of({ a: 1, b: 3 })))
    .toBeFalsy();
});

test('elems', () => {
  expect(Record.of({ a: 1, b: 2 }).elems())
    .toEqual(List.of(1, 2));
});

test('keys', () => {
  expect(Record.of({ a: 1, b: 2 }).keys())
    .toEqual(List.of('a', 'b'));
});

test('assocs', () => {
  expect(Record.of({ a: 1, b: 2 }).assocs())
    .toEqual(List.of(Tuple.of('a')(1), Tuple.of('b')(2)));
});

test('toObject', () => {
  expect(Record.of({ a: 1, b: 2 }).toObject())
    .toEqual({ a: 1, b: 2 });
});

test('Record.ofMaybe', () => {
  expect(Record.ofMaybe({ a: 1, b: Just(2) }))
    .toEqual(Record.of({ a: 1, b: 2 }));
  expect(Record.ofMaybe({ a: 1, b: Nothing() }))
    .toEqual(Record.of({ a: 1 }));
});

test('Record.get', () => {
  expect(Record.get('a')(Record.of({ a: 1, b: 2 }))).toEqual(1);
});
