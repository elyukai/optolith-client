const Extra = require('../Extra')
const { Just, Nothing } = require('../../Maybe')
const { Left, Right } = require('../../Either')

test ('fromLeft', () => {
  expect (Extra.fromLeft (0) (Left (3)))
    .toEqual (3)
  expect (Extra.fromLeft (0) (Right (3)))
    .toEqual (0)
})

test ('fromRight', () => {
  expect (Extra.fromRight (0) (Right (3)))
    .toEqual (3)
  expect (Extra.fromRight (0) (Left (3)))
    .toEqual (0)
})

test ('fromEither', () => {
  expect (Extra.fromEither (Right (3)))
    .toEqual (3)
  expect (Extra.fromEither (Left (0)))
    .toEqual (0)
})

test ('fromLeft_', () => {
  expect (Extra.fromLeft_ (Left (3)))
    .toEqual (3)
  expect (() => Extra.fromLeft_ (Right (3)))
    .toThrow ()
})

test ('fromRight_', () => {
  expect (Extra.fromRight_ (Right (3)))
    .toEqual (3)
  expect (() => Extra.fromRight_ (Left (3)))
    .toThrow ()
})

test ('eitherToMaybe', () => {
  expect (Extra.eitherToMaybe (Left (3)))
    .toEqual (Nothing)
  expect (Extra.eitherToMaybe (Right (3)))
    .toEqual (Just (3))
})

test ('maybeToEither', () => {
  expect (Extra.maybeToEither ('test') (Just (3)))
    .toEqual (Right (3))
  expect (Extra.maybeToEither ('test') (Nothing))
    .toEqual (Left ('test'))
})
