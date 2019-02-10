// @ts-check
const List = require('../List')
const { Pair } = require('../Pair')
const Either = require('../Either')
const { Just, Nothing } = require('../Maybe')
const { add } = require('../../App/Utils/mathUtils')
const { Left, Right } = require('../Either')

// CONSTRUCTORS

test ('Right', () => {
  expect (Right (3) .value) .toEqual (3)
  expect (Right (3) .isRight) .toEqual (true)
  expect (Right (3) .isLeft) .toEqual (false)
})

test ('Left', () => {
  expect (Left (3) .value) .toEqual (3)
  expect (Left (3) .isRight) .toEqual (false)
  expect (Left (3) .isLeft) .toEqual (true)
})

// EITHER.EXTRA

test ('fromLeft', () => {
  expect (Either.fromLeft (0) (Left (3)))
    .toEqual (3)
  expect (Either.fromLeft (0) (Right (3)))
    .toEqual (0)
})

test ('fromRight', () => {
  expect (Either.fromRight (0) (Right (3)))
    .toEqual (3)
  expect (Either.fromRight (0) (Left (3)))
    .toEqual (0)
})

test ('fromEither', () => {
  expect (Either.fromEither (Right (3)))
    .toEqual (3)
  expect (Either.fromEither (Left (0)))
    .toEqual (0)
})

test ('fromLeft_', () => {
  expect (Either.fromLeft_ (Left (3)))
    .toEqual (3)

  // @ts-ignore
  expect (() => Either.fromLeft_ (Right (3)))
    .toThrow ()
})

test ('fromRight_', () => {
  expect (Either.fromRight_ (Right (3)))
    .toEqual (3)

  // @ts-ignore
  expect (() => Either.fromRight_ (Left (3)))
    .toThrow ()
})

test ('eitherToMaybe', () => {
  expect (Either.eitherToMaybe (Left (3)))
    .toEqual (Nothing)
  expect (Either.eitherToMaybe (Right (3)))
    .toEqual (Just (3))
})

test ('maybeToEither', () => {
  expect (Either.maybeToEither ('test') (Just (3)))
    .toEqual (Right (3))
  expect (Either.maybeToEither ('test') (Nothing))
    .toEqual (Left ('test'))
})

test ('maybeToEither_', () => {
  expect (Either.maybeToEither_ (() => 'test') (Just (3)))
    .toEqual (Right (3))
  expect (Either.maybeToEither_ (() => 'test') (Nothing))
    .toEqual (Left ('test'))
})

// BIFUNCTOR

test ('bimap', () => {
  expect (Either.bimap (add (5)) (add (10)) (Left (3)))
    .toEqual (Left (8))
  expect (Either.bimap (add (5)) (add (10)) (Right (3)))
    .toEqual (Right (13))
})

test ('first', () => {
  expect (Either.first (add (5)) (Left (3)))
    .toEqual (Left (8))
  expect (Either.first (add (5)) (Right (3)))
    .toEqual (Right (3))
})

test ('second', () => {
  expect (Either.second (add (10)) (Left (3)))
    .toEqual (Left (3))
  expect (Either.second (add (10)) (Right (3)))
    .toEqual (Right (13))
})

// ORD

test ('gt', () => {
  expect (Either.gt (Right (1)) (Right (2)))
    .toBeTruthy ()
  expect (Either.gt (Right (1)) (Right (1)))
    .toBeFalsy ()
  expect (Either.gt (Right (1)) (Left (1)))
    .toBeFalsy ()
  expect (Either.gt (Left (2)) (Right (2)))
    .toBeTruthy ()
  expect (Either.gt (Left (1)) (Left (2)))
    .toBeTruthy ()
  expect (Either.gt (Left (1)) (Left (1)))
    .toBeFalsy ()
})

test ('lt', () => {
  expect (Either.lt (Right (3)) (Right (2)))
    .toBeTruthy ()
  expect (Either.lt (Right (1)) (Right (1)))
    .toBeFalsy ()
  expect (Either.lt (Right (3)) (Left (3)))
    .toBeTruthy ()
  expect (Either.lt (Left (3)) (Right (2)))
    .toBeFalsy ()
  expect (Either.lt (Left (2)) (Left (1)))
    .toBeTruthy ()
  expect (Either.lt (Left (1)) (Left (1)))
    .toBeFalsy ()
})

test ('gte', () => {
  expect (Either.gte (Right (1)) (Right (2)))
    .toBeTruthy ()
  expect (Either.gte (Right (2)) (Right (2)))
    .toBeTruthy ()
  expect (Either.gte (Right (2)) (Right (1)))
    .toBeFalsy ()
  expect (Either.gte (Right (1)) (Left (1)))
    .toBeFalsy ()
  expect (Either.gte (Right (2)) (Left (1)))
    .toBeFalsy ()
  expect (Either.gte (Right (1)) (Left (2)))
    .toBeFalsy ()
  expect (Either.gte (Left (1)) (Right (2)))
    .toBeTruthy ()
  expect (Either.gte (Left (1)) (Right (1)))
    .toBeTruthy ()
  expect (Either.gte (Left (1)) (Right (0)))
    .toBeTruthy ()
  expect (Either.gte (Left (1)) (Left (2)))
    .toBeTruthy ()
  expect (Either.gte (Left (1)) (Left (1)))
    .toBeTruthy ()
  expect (Either.gte (Left (1)) (Left (0)))
    .toBeFalsy ()
})

test ('lte', () => {
  expect (Either.lte (Right (3)) (Right (2)))
    .toBeTruthy ()
  expect (Either.lte (Right (2)) (Right (2)))
    .toBeTruthy ()
  expect (Either.lte (Right (2)) (Right (3)))
    .toBeFalsy ()
  expect (Either.lte (Right (1)) (Left (2)))
    .toBeTruthy ()
  expect (Either.lte (Right (1)) (Left (1)))
    .toBeTruthy ()
  expect (Either.lte (Right (1)) (Left (0)))
    .toBeTruthy ()
  expect (Either.lte (Left (1)) (Right (2)))
    .toBeFalsy ()
  expect (Either.lte (Left (1)) (Right (1)))
    .toBeFalsy ()
  expect (Either.lte (Left (1)) (Right (0)))
    .toBeFalsy ()
  expect (Either.lte (Left (1)) (Left (2)))
    .toBeFalsy ()
  expect (Either.lte (Left (1)) (Left (1)))
    .toBeTruthy ()
  expect (Either.lte (Left (1)) (Left (0)))
    .toBeTruthy ()
})

// SEMIGROUP

// test ('mappend', () => {
//   expect(Just (List.fromElements(3)).mappend(Just (List.fromElements(2))))
//     .toEqual(Just (List.fromElements(3, 2)))
//   expect(Just (List.fromElements(3)).mappend(Nothing))
//     .toEqual(Just (List.fromElements(3)))
//   expect(Nothing.mappend(Just (List.fromElements(2))))
//     .toEqual(Nothing)
//   expect(Nothing.mappend(Nothing))
//     .toEqual(Nothing)
// })

// EITHER FUNCTIONS

test ('isLeft', () => {
  expect (Either.isLeft (Left (3)))
    .toBeTruthy ()
  expect (Either.isLeft (Right (3)))
    .toBeFalsy ()
})

test ('isRight', () => {
  expect (Either.isRight (Left (3)))
    .toBeFalsy ()
  expect (Either.isRight (Right (3)))
    .toBeTruthy ()
})

test ('either', () => {
  expect (Either.either (add (10)) (add (1)) (Right (3)))
    .toEqual (4)
  expect (Either.either (add (10)) (add (1)) (Left (3)))
    .toEqual (13)
})

test ('lefts', () => {
  // @ts-ignore
  expect (Either.lefts (List.List (Left (3), Left (2), Right (2), Right (3), Left (4), Right (4))))
    .toEqual (List.List (3, 2, 4))
})

test ('rights', () => {
  // @ts-ignore
  expect (Either.rights (List.List (Left (3), Left (2), Right (2), Right (3), Left (4), Right (4))))
    .toEqual (List.List (2, 3, 4))
})

test ('partitionEithers', () => {
  // @ts-ignore
  expect (Either.partitionEithers (List.List (Left (3), Left (2), Right (2), Right (3), Left (4), Right (4))))
    .toEqual (Pair.fromBinary (List.List (3, 2, 4), List.List (2, 3, 4)))
})

// CUSTOM EITHER FUNCTIONS

test ('isEither', () => {
  expect (Either.isEither (4)) .toEqual (false)
  expect (Either.isEither (Right (4))) .toEqual (true)
  expect (Either.isEither (Left ('test'))) .toEqual (true)
})
