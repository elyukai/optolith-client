// @ts-check
const React = require('react');
const { List } = require('../List');
const { Maybe } = require('../Maybe');
const { fmap } = require('../Functor');
const { add } = require('../../App/Utils/mathUtils');
const { Just, Nothing } = require('../Maybe');

// CONSTRUCTORS

test ('Just', () => {
  expect (Just (3) .value) .toEqual (3)
  expect (Just (3) .isJust) .toEqual (true)
  expect (Just (3) .isNothing) .toEqual (false)
})

test ('Nothing', () => {
  expect (Nothing .isJust) .toEqual (false)
  expect (Nothing .isNothing) .toEqual (true)
})

test ('Maybe', () => {
  expect (Maybe (3)) .toEqual (Just (3))
  expect (Maybe (undefined)) .toEqual (Nothing)
  expect (Maybe (null)) .toEqual (Nothing)
})

// MAYBE FUNCTIONS (PART 1)

test ('isJust', () => {
  expect (Maybe.isJust (Maybe (3)))
    .toBeTruthy ()
  expect (Maybe.isJust (Maybe (null)))
    .toBeFalsy ()
})

test ('isNothing', () => {
  expect (Maybe.isNothing (Maybe (3)))
    .toBeFalsy ()
  expect (Maybe.isNothing (Maybe (null)))
    .toBeTruthy ()
})

test ('fromJust', () => {
  // @ts-ignore
  expect (Maybe.fromJust (Maybe (3)))
    .toEqual (3)
  // @ts-ignore
  expect (() => Maybe.fromJust (Maybe (null)))
    .toThrow ()
})

test ('fromMaybe', () => {
  expect (Maybe.fromMaybe (0) (Maybe (3)))
    .toEqual (3)
  expect (Maybe.fromMaybe (0) (Maybe (null)))
    .toEqual (0)
})

test ('fromMaybe_', () => {
  expect (Maybe.fromMaybe_ (() => 0) (Maybe (3)))
    .toEqual (3)
  expect (Maybe.fromMaybe_ (() => 0) (Maybe (null)))
    .toEqual (0)
})

// ORD

test ('gt', () => {
  expect (Maybe.gt (Just (1)) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.gt (Just (1)) (Just (1)))
    .toBeFalsy ()
  expect (Maybe.gt (Just (1)) (Nothing))
    .toBeFalsy ()
  expect (Maybe.gt (Nothing) (Just (2)))
    .toBeFalsy ()
  expect (Maybe.gt (Nothing) (Nothing))
    .toBeFalsy ()
})

test ('lt', () => {
  expect (Maybe.lt (Just (3)) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.lt (Just (1)) (Just (1)))
    .toBeFalsy ()
  expect (Maybe.lt (Just (3)) (Nothing))
    .toBeFalsy ()
  expect (Maybe.lt (Nothing) (Just (2)))
    .toBeFalsy ()
  expect (Maybe.lt (Nothing) (Nothing))
    .toBeFalsy ()
})

test ('gte', () => {
  expect (Maybe.gte (Just (1)) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.gte (Just (2)) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.gte (Just (2)) (Just (1)))
    .toBeFalsy ()
  expect (Maybe.gte (Just (1)) (Nothing))
    .toBeFalsy ()
  expect (Maybe.gte (Just (2)) (Nothing))
    .toBeFalsy ()
  expect (Maybe.gte (Nothing) (Just (2)))
    .toBeFalsy ()
  expect (Maybe.gte (Nothing) (Nothing))
    .toBeFalsy ()
})

test ('lte', () => {
  expect (Maybe.lte (Just (3)) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.lte (Just (2)) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.lte (Just (2)) (Just (3)))
    .toBeFalsy ()
  expect (Maybe.lte (Just (3)) (Nothing))
    .toBeFalsy ()
  expect (Maybe.lte (Just (2)) (Nothing))
    .toBeFalsy ()
  expect (Maybe.lte (Nothing) (Just (2)))
    .toBeFalsy ()
  expect (Maybe.lte (Nothing) (Nothing))
    .toBeFalsy ()
})

// SEMIGROUP

// test('mappend', () => {
//   expect(Just (List.fromElements(3)).mappend(Just (List.fromElements(2))))
//     .toEqual(Just (List.fromElements(3, 2)))
//   expect(Just (List.fromElements(3)).mappend(Nothing))
//     .toEqual(Just (List.fromElements(3)))
//   expect(Nothing.mappend(Just (List.fromElements(2))))
//     .toEqual(Nothing)
//   expect(Nothing.mappend(Nothing))
//     .toEqual(Nothing)
// })

// MAYBE FUNCTIONS (PART 2)

test ('maybe', () => {
  expect (Maybe.maybe (0) (x => x * 2) (Just (3)))
    .toEqual (6)
  expect (Maybe.maybe (0) (x => x * 2) (Nothing))
    .toEqual (0)
})

test ('listToMaybe', () => {
  expect (Maybe.listToMaybe (List (3)))
    .toEqual (Just (3))
  expect (Maybe.listToMaybe (List ()))
    .toEqual (Nothing)
})

test ('maybeToList', () => {
  expect (Maybe.maybeToList (Just (3)))
    .toEqual (List (3))
  expect (Maybe.maybeToList (Nothing))
    .toEqual (List ())
})

test ('catMaybes', () => {
  // @ts-ignore
  expect (Maybe.catMaybes (List (Just (3), Just (2), Nothing, Just (1))))
    .toEqual (List (3, 2, 1))
})

test ('mapMaybe', () => {
  expect (Maybe.mapMaybe (Maybe.ensure (x => x > 2)) (List (1, 2, 3, 4, 5)))
    .toEqual (List (3, 4, 5))
})

// CUSTOM MAYBE FUNCTIONS

test ('isMaybe', () => {
  expect (Maybe.isMaybe (4)) .toEqual (false)
  expect (Maybe.isMaybe (Just (4))) .toEqual (true)
  expect (Maybe.isMaybe (Nothing)) .toEqual (true)
})

test ('normalize', () => {
  expect (Maybe.normalize (4)) .toEqual (Just (4))
  expect (Maybe.normalize (Just (4))) .toEqual (Just (4))
  expect (Maybe.normalize (Nothing)) .toEqual (Nothing)
  expect (Maybe.normalize (undefined)) .toEqual (Nothing)
  expect (Maybe.normalize (null)) .toEqual (Nothing)
})

test ('ensure', () => {
  expect (Maybe.ensure (x => x > 2) (3))
    .toEqual (Just (3))
  expect (Maybe.ensure (x => x > 3) (3))
    .toEqual (Nothing)
})

test ('imapMaybe', () => {
  expect (Maybe.imapMaybe (i => e => fmap (add (i)) (Maybe.ensure (x => x > 2) (e))) (List(1, 2, 3, 4, 5)))
    .toEqual (List (5, 7, 9))
})

test ('maybeToNullable', () => {
  const element = React.createElement ('div')
  expect (Maybe.maybeToNullable (Nothing)) .toEqual (null)
  expect (Maybe.maybeToNullable (Just (element))) .toEqual (element)
})

test ('maybeToUndefined', () => {
  const element = React.createElement ('div')
  expect (Maybe.maybeToUndefined (Nothing)) .toEqual (undefined)
  expect (Maybe.maybeToUndefined (Just (element))) .toEqual (element)
})

test ('maybe_', () => {
  expect (Maybe.maybe_ (() => 0) (x => x * 2) (Just (3)))
    .toEqual (6)
  expect (Maybe.maybe_ (() => 0) (x => x * 2) (Nothing))
    .toEqual (0)
})
