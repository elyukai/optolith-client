const React = require('react');
const { List } = require('../list');
const { Tuple } = require('../tuple');
const Either = require('../Either');
const { Just, Nothing } = require('../maybe2');
const { add } = require('../../mathUtils');
const { Left, Right } = require('../either');

// EITHER FUNCTIONS (PART 1)

test('isLeft', () => {
  expect (Either.isLeft (Left (3)))
    .toBeTruthy ();
  expect (Either.isLeft (Right (3)))
    .toBeFalsy ();
});

test('isRight', () => {
  expect (Either.isRight (Left (3)))
    .toBeFalsy ();
  expect (Either.isRight (Right (3)))
    .toBeTruthy ();
});

// EITHER.EXTRA

test('fromLeft', () => {
  expect (Either.fromLeft (0) (Left (3)))
    .toEqual (3);
  expect (Either.fromLeft (0) (Right (3)))
    .toEqual (0);
});

test('fromRight', () => {
  expect (Either.fromRight (0) (Right (3)))
    .toEqual (3);
  expect (Either.fromRight (0) (Left (3)))
    .toEqual (0);
});

test('fromEither', () => {
  expect (Either.fromEither (Right (3)))
    .toEqual (3);
  expect (Either.fromEither (Left (0)))
    .toEqual (0);
});

test('fromLeft_', () => {
  expect (Either.fromLeft_ (Left (3)))
    .toEqual (3);
  expect (() => Either.fromLeft_ (Right (3)))
    .toThrow ();
});

test('fromRight_', () => {
  expect (Either.fromRight_ (Right (3)))
    .toEqual (3);
  expect (() => Either.fromRight_ (Left (3)))
    .toThrow ();
});

test('eitherToMaybe', () => {
  expect (Either.eitherToMaybe (Left (3)))
    .toEqual (Nothing);
  expect (Either.eitherToMaybe (Right (3)))
    .toEqual (Just (3));
});

test('maybeToEither', () => {
  expect (Either.maybeToEither ('test') (Just (3)))
    .toEqual (Right (3));
  expect (Either.maybeToEither ('test') (Nothing))
    .toEqual (Left ('test'));
});

// BIFUNCTOR

test('bimap', () => {
  expect (Either.bimap (add (5)) (add (10)) (Left (3)))
    .toEqual (Left (8));
  expect (Either.bimap (add (5)) (add (10)) (Right (3)))
    .toEqual (Right (13));
});

test('first', () => {
  expect (Either.first (add (5)) (Left (3)))
    .toEqual (Left (8));
  expect (Either.first (add (5)) (Right (3)))
    .toEqual (Right (3));
});

test('second', () => {
  expect (Either.second (add (10)) (Left (3)))
    .toEqual (Left (3));
  expect (Either.second (add (10)) (Right (3)))
    .toEqual (Right (13));
});

// MONAD

test('bind', () => {
  expect (Either.bind (Left (3))
                      (x => Right (x * 2)))
    .toEqual (Left (3));
  expect (Either.bind (Right (2))
                      (x => Right (x * 2)))
    .toEqual (Right (4));
  expect (Either.bind (Right (2))
                      (x => Left (x * 2)))
    .toEqual (Left (4));
});

test('bind_', () => {
  expect (Either.bind_ (x => Right (x * 2))
                       (Left (3)))
    .toEqual (Left (3));
  expect (Either.bind_ (x => Right (x * 2))
                       (Right (2)))
    .toEqual (Right (4));
  expect (Either.bind_ (x => Left (x * 2))
                       (Right (2)))
    .toEqual (Left (4));
});

test('then', () => {
  expect (Either.then (Right (3)) (Right (2)))
    .toEqual (Right (2));
  expect (Either.then (Left ('a')) (Right (2)))
    .toEqual (Left ('a'));
  expect (Either.then (Right (3)) (Left ('b')))
    .toEqual (Left ('b'));
  expect (Either.then (Left ('a')) (Left ('b')))
    .toEqual (Left ('a'));
});

test('mreturn', () => {
  expect (Either.mreturn (2)) .toEqual (Right (2));
});

test('kleisli', () => {
  expect (Either.kleisli (x => x > 5 ? Left ('too large') : Right (x))
                         (x => x < 0 ? Left ('too low') : Right (x))
                         (2))
    .toEqual (Right (2));
  expect (Either.kleisli (x => x > 5 ? Left ('too large') : Right (x))
                         (x => x < 0 ? Left ('too low') : Right (x))
                         (6))
    .toEqual (Left ('too large'));
  expect (Either.kleisli (x => x > 5 ? Left ('too large') : Right (x))
                         (x => x < 0 ? Left ('too low') : Right (x))
                         (-1))
    .toEqual (Left ('too low'));
});

// FUNCTOR

test('fmap', () => {
  expect (Either.fmap (x => x * 2) (Right (3)))
    .toEqual (Right (6));
  expect (Either.fmap (x => x * 2) (Left ('a')))
    .toEqual (Left ('a'));
});

test('mapReplace', () => {
  expect (Either.mapReplace (2) (Right (3)))
    .toEqual (Right (2));
  expect (Either.mapReplace (2) (Left ('a')))
    .toEqual (Left ('a'));
});

// APPLICATIVE

test('pure', () => {
  expect (Either.pure (2)) .toEqual (Right (2));
});

test('ap', () => {
  expect (Either.ap (Right (x => x * 2)) (Right (3)))
    .toEqual (Right (6));
  expect (Either.ap (Right (x => x * 2)) (Left ('b')))
    .toEqual (Left ('b'));
  expect (Either.ap (Left ('a')) (Right (3)))
    .toEqual (Left ('a'));
  expect (Either.ap (Left ('a')) (Left ('b')))
    .toEqual (Left ('a'));
});

// FOLDABLE

test('foldl', () => {
  expect (Either.foldl (acc => x => x * 2 + acc) (2) (Right (3)))
    .toEqual (8);
  expect (Either.foldl (acc => x => x * 2 + acc) (2) (Left ('a')))
    .toEqual (2);
});

test('elem', () => {
  expect (Either.elem (3) (Left ('a')))
    .toBeFalsy ();
  expect (Either.elem (3) (Right (2)))
    .toBeFalsy ();
  expect (Either.elem (3) (Right (3)))
    .toBeTruthy ();
});

test('elem_', () => {
  expect (Either.elem_ (Left ('a')) (3))
    .toBeFalsy ();
  expect (Either.elem_ (Right (2)) (3))
    .toBeFalsy ();
  expect (Either.elem_ (Right (3)) (3))
    .toBeTruthy ();
});

test('notElem', () => {
  expect (Either.notElem (3) (Left ('a')))
    .toBeTruthy ();
  expect (Either.notElem (3) (Right (2)))
    .toBeTruthy ();
  expect (Either.notElem (3) (Right (3)))
    .toBeFalsy ();
});

// EQ

test('equals', () => {
  expect (Either.equals (Right (3)) (Right (3)))
    .toBeTruthy ();
  expect (Either.equals (Left ('a')) (Left ('a')))
    .toBeTruthy ();
  expect (Either.equals (Right (3)) (Right (4)))
    .toBeFalsy ();
  expect (Either.equals (Left ('a')) (Left ('b')))
    .toBeFalsy ();
  expect (Either.equals (Left ('a')) (Right (4)))
    .toBeFalsy ();
  expect (Either.equals (Right (3)) (Left ('a')))
    .toBeFalsy ();
});

test('notEquals', () => {
  expect (Either.notEquals (Right (3)) (Right (5)))
    .toBeTruthy ();
  expect (Either.notEquals (Left ('a')) (Left ('b')))
    .toBeTruthy ();
  expect (Either.notEquals (Left ('a')) (Right (5)))
    .toBeTruthy ();
  expect (Either.notEquals (Right (3)) (Left ('a')))
    .toBeTruthy ();
  expect (Either.notEquals (Right (2)) (Right (2)))
    .toBeFalsy ();
  expect (Either.notEquals (Left ('a')) (Left ('a')))
    .toBeFalsy ();
});

// ORD

test('gt', () => {
  expect (Either.gt (Right (2)) (Right (1)))
    .toBeTruthy ();
  expect (Either.gt (Right (1)) (Right (1)))
    .toBeFalsy ();
  expect (Either.gt (Left (1)) (Right (1)))
    .toBeFalsy ();
  expect (Either.gt (Right (2)) (Left (2)))
    .toBeTruthy ();
  expect (Either.gt (Left (2)) (Left (1)))
    .toBeTruthy ();
  expect (Either.gt (Left (1)) (Left (1)))
    .toBeFalsy ();
});

test('lt', () => {
  expect (Either.lt (Right (2)) (Right (3)))
    .toBeTruthy ();
  expect (Either.lt (Right (1)) (Right (1)))
    .toBeFalsy ();
  expect (Either.lt (Left (3)) (Right (3)))
    .toBeTruthy ();
  expect (Either.lt (Right (2)) (Left (3)))
    .toBeFalsy ();
  expect (Either.lt (Left (1)) (Left (2)))
    .toBeTruthy ();
  expect (Either.lt (Left (1)) (Left (1)))
    .toBeFalsy ();
});

test('gte', () => {
  expect (Either.gte (Right (2)) (Right (1)))
    .toBeTruthy ();
  expect (Either.gte (Right (2)) (Right (2)))
    .toBeTruthy ();
  expect (Either.gte (Right (1)) (Right (2)))
    .toBeFalsy ();
  expect (Either.gte (Left (1)) (Right (1)))
    .toBeFalsy ();
  expect (Either.gte (Left (1)) (Right (2)))
    .toBeFalsy ();
  expect (Either.gte (Left (2)) (Right (1)))
    .toBeFalsy ();
  expect (Either.gte (Right (2)) (Left (1)))
    .toBeTruthy ();
  expect (Either.gte (Right (1)) (Left (1)))
    .toBeTruthy ();
  expect (Either.gte (Right (0)) (Left (1)))
    .toBeTruthy ();
  expect (Either.gte (Left (2)) (Left (1)))
    .toBeTruthy ();
  expect (Either.gte (Left (1)) (Left (1)))
    .toBeTruthy ();
  expect (Either.gte (Left (0)) (Left (1)))
    .toBeFalsy ();
});

test('lte', () => {
  expect (Either.lte (Right (2)) (Right (3)))
    .toBeTruthy ();
  expect (Either.lte (Right (2)) (Right (2)))
    .toBeTruthy ();
  expect (Either.lte (Right (3)) (Right (2)))
    .toBeFalsy ();
  expect (Either.lte (Left (2)) (Right (1)))
    .toBeTruthy ();
  expect (Either.lte (Left (1)) (Right (1)))
    .toBeTruthy ();
  expect (Either.lte (Left (0)) (Right (1)))
    .toBeTruthy ();
  expect (Either.lte (Right (2)) (Left (1)))
    .toBeFalsy ();
  expect (Either.lte (Right (1)) (Left (1)))
    .toBeFalsy ();
  expect (Either.lte (Right (0)) (Left (1)))
    .toBeFalsy ();
  expect (Either.lte (Left (2)) (Left (1)))
    .toBeFalsy ();
  expect (Either.lte (Left (1)) (Left (1)))
    .toBeTruthy ();
  expect (Either.lte (Left (0)) (Left (1)))
    .toBeTruthy ();
});

// SHOW

test('prototype.toString', () => {
  expect (Right (3) .toString ())
    .toEqual ('Right 3');
  expect (Right ([1, 2, 3]) .toString ())
    .toEqual ('Right 1,2,3');
  expect (Left ('a') .toString ())
    .toEqual ('Left a');
  expect (Left ([1, 2, 3]) .toString ())
    .toEqual ('Left 1,2,3');
});

test('show', () => {
  expect (Either.show (Right (3)))
    .toEqual ('Right 3');
  expect (Either.show (Right ([1, 2, 3])))
    .toEqual ('Right 1,2,3');
  expect (Either.show (Left ('a')))
    .toEqual ('Left a');
  expect (Either.show (Left ([1, 2, 3])))
    .toEqual ('Left 1,2,3');
});

// SEMIGROUP

// test('mappend', () => {
//   expect(Just (List.of(3)).mappend(Just (List.of(2))))
//     .toEqual(Just (List.of(3, 2)));
//   expect(Just (List.of(3)).mappend(Nothing))
//     .toEqual(Just (List.of(3)));
//   expect(Nothing.mappend(Just (List.of(2))))
//     .toEqual(Nothing);
//   expect(Nothing.mappend(Nothing))
//     .toEqual(Nothing);
// });

// EITHER FUNCTIONS (PART 2)

test('either', () => {
  expect (Either.either (add (10)) (add (1)) (Right (3)))
    .toEqual (4);
  expect (Either.either (add (10)) (add (1)) (Left (3)))
    .toEqual (13);
});

test('lefts', () => {
  expect (Either.lefts (List.of (Left (3), Left (2), Right (2), Right (3), Left (4), Right (4))))
    .toEqual (List.of (3, 2, 4));
});

test('rights', () => {
  expect (Either.rights (List.of (Left (3), Left (2), Right (2), Right (3), Left (4), Right (4))))
    .toEqual (List.of (2, 3, 4));
});

test('partitionEithers', () => {
  expect (Either.partitionEithers (List.of (Left (3), Left (2), Right (2), Right (3), Left (4), Right (4))))
    .toEqual (Tuple.of (List.of (3, 2, 4)) (List.of (2, 3, 4)));
});
