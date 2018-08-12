const { List } = require('../list');
const { Just, Maybe, Nothing } = require('../maybe');

test('Maybe.return -> Just', () => {
  expect(Maybe.return(3).value).toEqual(3);
});

test('Maybe.return -> Nothing', () => {
  expect(Maybe.return(undefined).value).toBeUndefined();
  expect(Maybe.return(null).value).toBeUndefined();
});

test('equals', () => {
  expect(Maybe.return(3).equals(Maybe.return(3)))
    .toBeTruthy();
  expect(Maybe.return(3).equals(Maybe.return(4)))
    .toBeFalsy();
});

test('notEquals', () => {
  expect(Maybe.return(3).notEquals(Maybe.return(5)))
    .toBeTruthy();
  expect(Maybe.return(2).notEquals(Maybe.return(2)))
    .toBeFalsy();
});

test('gt', () => {
  expect(Maybe.return(2).gt(Maybe.return(1)))
    .toBeTruthy();
  expect(Maybe.return(1).gt(Maybe.return(1)))
    .toBeFalsy();
});

test('lt', () => {
  expect(Maybe.return(2).lt(Maybe.return(3)))
    .toBeTruthy();
  expect(Maybe.return(1).lt(Maybe.return(1)))
    .toBeFalsy();
});

test('gte', () => {
  expect(Maybe.return(2).gte(Maybe.return(1)))
    .toBeTruthy();
  expect(Maybe.return(2).gte(Maybe.return(2)))
    .toBeTruthy();
  expect(Maybe.return(1).gte(Maybe.return(2)))
    .toBeFalsy();
});

test('lte', () => {
  expect(Maybe.return(2).lte(Maybe.return(3)))
    .toBeTruthy();
  expect(Maybe.return(2).lte(Maybe.return(2)))
    .toBeTruthy();
  expect(Maybe.return(3).lte(Maybe.return(2)))
    .toBeFalsy();
});

test('gt/lt/gte/lte always false when at least one Maybe is Nothing', () => {
  expect(Maybe.return(3).gt(Maybe.return(undefined)))
    .toBeFalsy();
  expect(Maybe.return(undefined).gt(Maybe.return(3)))
    .toBeFalsy();
  expect(Maybe.return(undefined).gt(Maybe.return(undefined)))
    .toBeFalsy();
  expect(Maybe.return(3).lt(Maybe.return(undefined)))
    .toBeFalsy();
  expect(Maybe.return(undefined).lt(Maybe.return(3)))
    .toBeFalsy();
  expect(Maybe.return(undefined).lt(Maybe.return(undefined)))
    .toBeFalsy();
  expect(Maybe.return(3).gte(Maybe.return(undefined)))
    .toBeFalsy();
  expect(Maybe.return(undefined).gte(Maybe.return(3)))
    .toBeFalsy();
  expect(Maybe.return(undefined).gte(Maybe.return(undefined)))
    .toBeFalsy();
  expect(Maybe.return(3).lte(Maybe.return(undefined)))
    .toBeFalsy();
  expect(Maybe.return(undefined).lte(Maybe.return(3)))
    .toBeFalsy();
  expect(Maybe.return(undefined).lte(Maybe.return(undefined)))
    .toBeFalsy();
});

test('fmap', () => {
  expect(Maybe.return(3).fmap(x => x * 2))
    .toEqual(Maybe.return(6));
  expect(Maybe.return(null).fmap(x => x * 2))
    .toEqual(Maybe.return(null));
});

test('bind', () => {
  expect(Maybe.return(3).bind(x => Maybe.return(x * 2)))
    .toEqual(Maybe.return(6));
  expect(Maybe.return(null).bind(x => Maybe.return(x * 2)))
    .toEqual(Maybe.return(null));
});

test('sequence', () => {
  expect(Maybe.return(3).sequence(Maybe.return(2)))
    .toEqual(Maybe.return(2));
  expect(Maybe.return(null).sequence(Maybe.return(2)))
    .toEqual(Maybe.return(null));
  expect(Maybe.return(3).sequence(Maybe.return(null)))
    .toEqual(Maybe.return(null));
  expect(Maybe.return(null).sequence(Maybe.return(null)))
    .toEqual(Maybe.return(null));
});

test('ap', () => {
  expect(Maybe.return(3).ap(Maybe.return(x => x * 2)))
    .toEqual(Maybe.return(6));
  expect(Maybe.return(null).ap(Maybe.return(x => x * 2)))
    .toEqual(Maybe.return(null));
  expect(Maybe.return(3).ap(Maybe.return(null)))
    .toEqual(Maybe.return(null));
  expect(Maybe.return(null).ap(Maybe.return(null)))
    .toEqual(Maybe.return(null));
});

test('foldl', () => {
  expect(Maybe.return(3).foldl(
    acc => x => x * 2 + acc,
    2
  ))
    .toEqual(8);
  expect(Maybe.return(null).foldl(
    acc => x => x * 2 + acc,
    2
  ))
    .toEqual(2);
});

test('concat', () => {
  expect(Maybe.return(List.of(3)).concat(Maybe.return(List.of(2))))
    .toEqual(Maybe.return(List.of(3, 2)));
  expect(Maybe.return(List.of(3)).concat(Maybe.return(null)))
    .toEqual(Maybe.return(List.of(3)));
  expect(Maybe.return(null).concat(Maybe.return(List.of(2))))
    .toEqual(Maybe.return(null));
  expect(Maybe.return(null).concat(Maybe.return(null)))
    .toEqual(Maybe.return(null));
});

test('alt', () => {
  expect(Maybe.return(3).alt(Maybe.return(2)))
    .toEqual(Maybe.return(3));
  expect(Maybe.return(3).alt(Maybe.return(null)))
    .toEqual(Maybe.return(3));
  expect(Maybe.return(null).alt(Maybe.return(2)))
    .toEqual(Maybe.return(2));
  expect(Maybe.return(null).alt(Maybe.return(null)))
    .toEqual(Maybe.return(null));
});

test('toString', () => {
  expect(Maybe.return(3).toString())
    .toEqual('Just(3)');
  expect(Maybe.return([1, 2, 3]).toString())
    .toEqual('Just([1, 2, 3])');
  expect(Maybe.return(null).toString())
    .toEqual('Nothing');
});

test('Maybe.ensure', () => {
  expect(Maybe.ensure(x => x > 2, 3))
    .toEqual(Maybe.return(3));
  expect(Maybe.ensure(x => x > 2)(3))
    .toEqual(Maybe.return(3));
  expect(Maybe.ensure(x => x > 3, 3))
    .toEqual(Maybe.return(null));
  expect(Maybe.ensure(x => x > 3)(3))
    .toEqual(Maybe.return(null));
});

test('Maybe.maybe', () => {
  expect(Maybe.maybe(0, x => x * 2, Maybe.return(3)))
    .toEqual(6);
  expect(Maybe.maybe(0, x => x * 2)(Maybe.return(3)))
    .toEqual(6);
  expect(Maybe.maybe(0)(x => x * 2)(Maybe.return(3)))
    .toEqual(6);
  expect(Maybe.maybe(0, x => x * 2, Maybe.return(null)))
    .toEqual(0);
  expect(Maybe.maybe(0, x => x * 2)(Maybe.return(null)))
    .toEqual(0);
  expect(Maybe.maybe(0)(x => x * 2)(Maybe.return(null)))
    .toEqual(0);
});

test('Maybe.isJust', () => {
  expect(Maybe.isJust(Maybe.return(3)))
    .toBeTruthy();
  expect(Maybe.isJust(Maybe.return(null)))
    .toBeFalsy();
  expect(Maybe.isJust(Maybe.return(undefined)))
    .toBeFalsy();
});

test('Maybe.isNothing', () => {
  expect(Maybe.isNothing(Maybe.return(null)))
    .toBeTruthy();
  expect(Maybe.isNothing(Maybe.return(undefined)))
    .toBeTruthy();
  expect(Maybe.isNothing(Maybe.return(3)))
    .toBeFalsy();
});

test('Maybe.fromJust', () => {
  expect(Maybe.fromJust(Maybe.return(3)))
    .toEqual(3);
  expect(() => Maybe.fromJust(Maybe.return(null)))
    .toThrow();
  expect(() => Maybe.fromJust(Maybe.return(undefined)))
    .toThrow();
});

test('Maybe.fromMaybe', () => {
  expect(Maybe.fromMaybe(0, Maybe.return(3)))
    .toEqual(3);
  expect(Maybe.fromMaybe(0)(Maybe.return(3)))
    .toEqual(3);
  expect(Maybe.fromMaybe(0, Maybe.return(null)))
    .toEqual(0);
  expect(Maybe.fromMaybe(0)(Maybe.return(null)))
    .toEqual(0);
});

test('Maybe.listToMaybe', () => {
  expect(Maybe.listToMaybe(List.of(3)))
    .toEqual(Maybe.return(3));
  expect(Maybe.listToMaybe(List.of()))
    .toEqual(Maybe.return(null));
});

test('Maybe.maybeToList', () => {
  expect(Maybe.maybeToList(Maybe.return(3)))
    .toEqual(List.of(3));
  expect(Maybe.maybeToList(Maybe.return(null)))
    .toEqual(List.of());
});

test('Maybe.catMaybes', () => {
  expect(Maybe.catMaybes(List.of(
    Maybe.return(3),
    Maybe.return(2),
    Maybe.return(null),
    Maybe.return(1)
  )))
    .toEqual(List.of(3, 2, 1));
});

test('Maybe.mapMaybe', () => {
  expect(Maybe.mapMaybe(Maybe.ensure(x => x > 2), List.of(1, 2, 3, 4, 5)))
    .toEqual(List.of(3, 4, 5));
  expect(Maybe.mapMaybe(Maybe.ensure(x => x > 2))(List.of(1, 2, 3, 4, 5)))
    .toEqual(List.of(3, 4, 5));
});

test('Maybe.Just', () => {
  expect(Maybe.Just(3))
    .toEqual(Maybe.return(3));
});

test('Maybe.Nothing', () => {
  expect(Maybe.Nothing())
    .toEqual(Maybe.return(null));
});

test('Maybe.equals', () => {
  expect(Maybe.equals(Maybe.return(3), Maybe.return(3)))
    .toBeTruthy();
  expect(Maybe.equals(Maybe.return(3))(Maybe.return(3)))
    .toBeTruthy();
  expect(Maybe.equals(Maybe.return(3), Maybe.return(4)))
    .toBeFalsy();
  expect(Maybe.equals(Maybe.return(3))(Maybe.return(4)))
    .toBeFalsy();
});

test('Maybe.fmap', () => {
  expect(Maybe.fmap(x => x * 2, Maybe.return(3)))
    .toEqual(Maybe.return(6));
  expect(Maybe.fmap(x => x * 2)(Maybe.return(3)))
    .toEqual(Maybe.return(6));
  expect(Maybe.fmap(x => x * 2, Maybe.return(null)))
    .toEqual(Maybe.return(null));
  expect(Maybe.fmap(x => x * 2)(Maybe.return(null)))
    .toEqual(Maybe.return(null));
});

test('Maybe.bind', () => {
  expect(Maybe.bind(Maybe.return(3), x => Maybe.return(x * 2)))
    .toEqual(Maybe.return(6));
  expect(Maybe.bind(Maybe.return(3))(x => Maybe.return(x * 2)))
    .toEqual(Maybe.return(6));
  expect(Maybe.bind(Maybe.return(null), x => Maybe.return(x * 2)))
    .toEqual(Maybe.return(null));
  expect(Maybe.bind(Maybe.return(null))(x => Maybe.return(x * 2)))
    .toEqual(Maybe.return(null));
});

test('Just', () => {
  expect(Just(3))
    .toEqual(Maybe.return(3));
});

test('Nothing', () => {
  expect(Nothing())
    .toEqual(Maybe.return(null));
});
