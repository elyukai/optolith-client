const { List } = require('../list');
const { Just, Maybe, Nothing } = require('../maybe');

test('Maybe.of -> Just', () => {
  expect(Maybe.of (3).value).toEqual(3);
});

test('Maybe.of -> Nothing', () => {
  expect(Maybe.of (undefined).value).toBeUndefined();
  expect(Maybe.of (null).value).toBeUndefined();
});

test('Maybe.fromNullable -> Just', () => {
  expect(Maybe.fromNullable (3).value).toEqual(3);
});

test('Maybe.fromNullable -> Nothing', () => {
  expect(Maybe.fromNullable (undefined).value).toBeUndefined();
  expect(Maybe.fromNullable (null).value).toBeUndefined();
});

test('Maybe.normalize', () => {
  expect(Maybe.normalize (4)).toEqual(Just (4));
  expect(Maybe.normalize (Just (4))).toEqual(Just (4));
  expect(Maybe.normalize (undefined)).toEqual(Nothing ());
  expect(Maybe.normalize (null)).toEqual(Nothing ());
});

test('equals', () => {
  expect(Maybe.of(3).equals(Maybe.of(3)))
    .toBeTruthy();
  expect(Maybe.of(3).equals(Maybe.of(4)))
    .toBeFalsy();
});

test('notEquals', () => {
  expect(Maybe.of(3).notEquals(Maybe.of(5)))
    .toBeTruthy();
  expect(Maybe.of(2).notEquals(Maybe.of(2)))
    .toBeFalsy();
});

test('gt', () => {
  expect(Maybe.of(2).gt(Maybe.of(1)))
    .toBeTruthy();
  expect(Maybe.of(1).gt(Maybe.of(1)))
    .toBeFalsy();
});

test('lt', () => {
  expect(Maybe.of(2).lt(Maybe.of(3)))
    .toBeTruthy();
  expect(Maybe.of(1).lt(Maybe.of(1)))
    .toBeFalsy();
});

test('gte', () => {
  expect(Maybe.of(2).gte(Maybe.of(1)))
    .toBeTruthy();
  expect(Maybe.of(2).gte(Maybe.of(2)))
    .toBeTruthy();
  expect(Maybe.of(1).gte(Maybe.of(2)))
    .toBeFalsy();
});

test('lte', () => {
  expect(Maybe.of(2).lte(Maybe.of(3)))
    .toBeTruthy();
  expect(Maybe.of(2).lte(Maybe.of(2)))
    .toBeTruthy();
  expect(Maybe.of(3).lte(Maybe.of(2)))
    .toBeFalsy();
});

test('gt/lt/gte/lte always false when at least one Maybe is Nothing', () => {
  expect(Maybe.of(3).gt(Maybe.of(undefined)))
    .toBeFalsy();
  expect(Maybe.of(undefined).gt(Maybe.of(3)))
    .toBeFalsy();
  expect(Maybe.of(undefined).gt(Maybe.of(undefined)))
    .toBeFalsy();
  expect(Maybe.of(3).lt(Maybe.of(undefined)))
    .toBeFalsy();
  expect(Maybe.of(undefined).lt(Maybe.of(3)))
    .toBeFalsy();
  expect(Maybe.of(undefined).lt(Maybe.of(undefined)))
    .toBeFalsy();
  expect(Maybe.of(3).gte(Maybe.of(undefined)))
    .toBeFalsy();
  expect(Maybe.of(undefined).gte(Maybe.of(3)))
    .toBeFalsy();
  expect(Maybe.of(undefined).gte(Maybe.of(undefined)))
    .toBeFalsy();
  expect(Maybe.of(3).lte(Maybe.of(undefined)))
    .toBeFalsy();
  expect(Maybe.of(undefined).lte(Maybe.of(3)))
    .toBeFalsy();
  expect(Maybe.of(undefined).lte(Maybe.of(undefined)))
    .toBeFalsy();
});

test('fmap', () => {
  expect(Maybe.of(3).fmap(x => x * 2))
    .toEqual(Maybe.of(6));
  expect(Maybe.of(null).fmap(x => x * 2))
    .toEqual(Maybe.of(null));
});

test('bind', () => {
  expect(Maybe.of(3).bind(x => Maybe.of(x * 2)))
    .toEqual(Maybe.of(6));
  expect(Maybe.of(null).bind(x => Maybe.of(x * 2)))
    .toEqual(Maybe.of(null));
});

test('then', () => {
  expect(Maybe.of(3).then(Maybe.of(2)))
    .toEqual(Maybe.of(2));
  expect(Maybe.of(null).then(Maybe.of(2)))
    .toEqual(Maybe.of(null));
  expect(Maybe.of(3).then(Maybe.of(null)))
    .toEqual(Maybe.of(null));
  expect(Maybe.of(null).then(Maybe.of(null)))
    .toEqual(Maybe.of(null));
});

test('Maybe.then', () => {
  expect (Maybe.then (Maybe.of (3)) (Maybe.of (2)))
    .toEqual (Maybe.of (2));
  expect (Maybe.then (Maybe.of (null)) (Maybe.of (2)))
    .toEqual (Maybe.of (null));
  expect (Maybe.then (Maybe.of (3)) (Maybe.of (null)))
    .toEqual (Maybe.of (null));
  expect (Maybe.then (Maybe.of (null)) (Maybe.of (null)))
    .toEqual (Maybe.of (null));
});

test('ap', () => {
  expect(Maybe.of(3).ap(Maybe.of(x => x * 2)))
    .toEqual(Maybe.of(6));
  expect(Maybe.of(null).ap(Maybe.of(x => x * 2)))
    .toEqual(Maybe.of(null));
  expect(Maybe.of(3).ap(Maybe.of(null)))
    .toEqual(Maybe.of(null));
  expect(Maybe.of(null).ap(Maybe.of(null)))
    .toEqual(Maybe.of(null));
});

test('foldl', () => {
  expect(Maybe.of(3).foldl (acc => x => x * 2 + acc) (2))
    .toEqual(8);
  expect(Maybe.of(null).foldl (acc => x => x * 2 + acc) (2))
    .toEqual(2);
});

test('Maybe.elem', () => {
  expect(Maybe.elem (3) (Maybe.of(null)))
    .toBeFalsy();
  expect(Maybe.elem (3) (Maybe.of(2)))
    .toBeFalsy();
  expect(Maybe.elem (3) (Maybe.of(3)))
    .toBeTruthy();
});

test('Maybe.notElem', () => {
  expect(Maybe.notElem (3) (Maybe.of(null)))
    .toBeTruthy();
  expect(Maybe.notElem (3) (Maybe.of(2)))
    .toBeTruthy();
  expect(Maybe.notElem (3) (Maybe.of(3)))
    .toBeFalsy();
});

test('mappend', () => {
  expect(Maybe.of(List.of(3)).mappend(Maybe.of(List.of(2))))
    .toEqual(Maybe.of(List.of(3, 2)));
  expect(Maybe.of(List.of(3)).mappend(Maybe.of(null)))
    .toEqual(Maybe.of(List.of(3)));
  expect(Maybe.of(null).mappend(Maybe.of(List.of(2))))
    .toEqual(Maybe.of(null));
  expect(Maybe.of(null).mappend(Maybe.of(null)))
    .toEqual(Maybe.of(null));
});

test('alt', () => {
  expect(Maybe.of(3).alt(Maybe.of(2)))
    .toEqual(Maybe.of(3));
  expect(Maybe.of(3).alt(Maybe.of(null)))
    .toEqual(Maybe.of(3));
  expect(Maybe.of(null).alt(Maybe.of(2)))
    .toEqual(Maybe.of(2));
  expect(Maybe.of(null).alt(Maybe.of(null)))
    .toEqual(Maybe.of(null));
});

test('Maybe.alt', () => {
  expect(Maybe.alt (Maybe.of(3)) (Maybe.of(2)))
    .toEqual(Maybe.of(3));
  expect(Maybe.alt (Maybe.of(3)) (Maybe.of(null)))
    .toEqual(Maybe.of(3));
  expect(Maybe.alt (Maybe.of(null)) (Maybe.of(2)))
    .toEqual(Maybe.of(2));
  expect(Maybe.alt (Maybe.of(null)) (Maybe.of(null)))
    .toEqual(Maybe.of(null));
});

test('Maybe.alt_', () => {
  expect(Maybe.alt_ (Maybe.of(2)) (Maybe.of(3)))
    .toEqual(Maybe.of(3));
  expect(Maybe.alt_ (Maybe.of(null)) (Maybe.of(3)))
    .toEqual(Maybe.of(3));
  expect(Maybe.alt_ (Maybe.of(2)) (Maybe.of(null)))
    .toEqual(Maybe.of(2));
  expect(Maybe.alt_ (Maybe.of(null)) (Maybe.of(null)))
    .toEqual(Maybe.of(null));
});

test('toString', () => {
  expect(Maybe.of(3).toString())
    .toEqual('Just 3');
  expect(Maybe.of([1, 2, 3]).toString())
    .toEqual('Just [1, 2, 3]');
  expect(Maybe.of(null).toString())
    .toEqual('Nothing');
});

test('Maybe.ensure', () => {
  expect(Maybe.ensure(x => x > 2)(3))
    .toEqual(Maybe.of(3));
  expect(Maybe.ensure(x => x > 3)(3))
    .toEqual(Maybe.of(null));
});

test('Maybe.maybe', () => {
  expect(Maybe.maybe(0)(x => x * 2)(Maybe.of(3)))
    .toEqual(6);
  expect(Maybe.maybe(0)(x => x * 2)(Maybe.of(null)))
    .toEqual(0);
});

test('Maybe.isJust', () => {
  expect(Maybe.isJust(Maybe.of(3)))
    .toBeTruthy();
  expect(Maybe.isJust(Maybe.of(null)))
    .toBeFalsy();
  expect(Maybe.isJust(Maybe.of(undefined)))
    .toBeFalsy();
});

test('Maybe.isNothing', () => {
  expect(Maybe.isNothing(Maybe.of(null)))
    .toBeTruthy();
  expect(Maybe.isNothing(Maybe.of(undefined)))
    .toBeTruthy();
  expect(Maybe.isNothing(Maybe.of(3)))
    .toBeFalsy();
});

test('Maybe.fromJust', () => {
  expect(Maybe.fromJust(Maybe.of(3)))
    .toEqual(3);
  expect(() => Maybe.fromJust(Maybe.of(null)))
    .toThrow();
  expect(() => Maybe.fromJust(Maybe.of(undefined)))
    .toThrow();
});

test('Maybe.fromMaybe', () => {
  expect(Maybe.fromMaybe(0)(Maybe.of(3)))
    .toEqual(3);
  expect(Maybe.fromMaybe(0)(Maybe.of(null)))
    .toEqual(0);
});

test('Maybe.listToMaybe', () => {
  expect(Maybe.listToMaybe(List.of(3)))
    .toEqual(Maybe.of(3));
  expect(Maybe.listToMaybe(List.of()))
    .toEqual(Maybe.of(null));
});

test('Maybe.maybeToList', () => {
  expect(Maybe.maybeToList(Maybe.of(3)))
    .toEqual(List.of(3));
  expect(Maybe.maybeToList(Maybe.of(null)))
    .toEqual(List.of());
});

test('Maybe.catMaybes', () => {
  expect(Maybe.catMaybes(List.of(
    Maybe.of(3),
    Maybe.of(2),
    Maybe.of(null),
    Maybe.of(1)
  )))
    .toEqual(List.of(3, 2, 1));
});

test('Maybe.mapMaybe', () => {
  expect(Maybe.mapMaybe(Maybe.ensure(x => x > 2))(List.of(1, 2, 3, 4, 5)))
    .toEqual(List.of(3, 4, 5));
});

test('Maybe.pure', () => {
  expect(Maybe.pure(3))
    .toEqual(Maybe.of(3));
});

test('Maybe.return', () => {
  expect(Maybe.return(3))
    .toEqual(Maybe.pure(3));
});

test('Maybe.empty', () => {
  expect(Maybe.empty())
    .toEqual(Maybe.of(null));
});

test('Maybe.equals', () => {
  expect(Maybe.equals(Maybe.of(3))(Maybe.of(3)))
    .toBeTruthy();
  expect(Maybe.equals(Maybe.of(3))(Maybe.of(4)))
    .toBeFalsy();
});

test('Maybe.fmap', () => {
  expect(Maybe.fmap(x => x * 2)(Maybe.of(3)))
    .toEqual(Maybe.of(6));
  expect(Maybe.fmap(x => x * 2)(Maybe.of(null)))
    .toEqual(Maybe.of(null));
});

test('Maybe.bind', () => {
  expect(Maybe.bind(Maybe.of(3))(x => Maybe.of(x * 2)))
    .toEqual(Maybe.of(6));
  expect(Maybe.bind(Maybe.of(null))(x => Maybe.of(x * 2)))
    .toEqual(Maybe.of(null));
});

test('Just', () => {
  expect(Just(3))
    .toEqual(Maybe.of(3));
});

test('Nothing', () => {
  expect(Nothing())
    .toEqual(Maybe.of(null));
});
