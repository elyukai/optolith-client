// @ts-check
const { Left, Right } = require ('../../Data/Either');
const { List } = require ('../../Data/List');
const { Just, Nothing } = require ('../../Data/Maybe');
const Applicative = require ('../Applicative');
const { Identity } = require ('../Monad/Identity');

test ('pure', () => {
  expect (Applicative.pure ("Either") (2)) .toEqual (Right (2))

  expect (Applicative.pure ("Identity") (4)) .toEqual (Identity (4))

  expect (Applicative.pure ("List") (3)) .toEqual (List (3))

  expect (Applicative.pure ("Maybe") (2)) .toEqual (Just (2))
})

test ('ap', () => {
  expect (Applicative.ap (Right (x => x * 2)) (Right (3)))
    .toEqual (Right (6))

  expect (Applicative.ap (Right (x => x * 2)) (Left ('b')))
    .toEqual (Left ('b'))

  expect (Applicative.ap (Left ('a')) (Right (3)))
    .toEqual (Left ('a'))

  expect (Applicative.ap (Left ('a')) (Left ('b')))
    .toEqual (Left ('a'))

  expect (Applicative.ap (Identity (x => x * 2)) (Identity (3)))
    .toEqual (Identity (6))

  expect (Applicative.ap (List (x => x * 3, x => x * 2))
                         (List (1, 2, 3, 4, 5)))
    .toEqual (List (3, 6, 9, 12, 15, 2, 4, 6, 8, 10))

  expect (Applicative.ap (Just (x => x * 2)) (Just (3)))
    .toEqual (Just (6))

  expect (Applicative.ap (Just (x => x * 2)) (Nothing))
    .toEqual (Nothing)

  expect (Applicative.ap (Nothing) (Just (3)))
    .toEqual (Nothing)

  expect (Applicative.ap (Nothing) (Nothing))
    .toEqual (Nothing)
})

// ALTERNATIVE

test ('alt', () => {
  expect (Applicative.alt (Just (3)) (Just (2)))
    .toEqual (Just (3))

  expect (Applicative.alt (Just (3)) (Nothing))
    .toEqual (Just (3))

  expect (Applicative.alt (Nothing) (Just (2)))
    .toEqual (Just (2))

  expect (Applicative.alt (Nothing) (Nothing))
    .toEqual (Nothing)

  expect (Applicative.alt (List (3)) (List (2)))
    .toEqual (List (3))

  expect (Applicative.alt (List (3)) (List ()))
    .toEqual (List (3))

  expect (Applicative.alt (List ()) (List (2)))
    .toEqual (List (2))

  expect (Applicative.alt (List ()) (List ()))
    .toEqual (List ())
})

test ('alt_', () => {
  expect (Applicative.alt_ (Just (3)) (() => Just (2)))
    .toEqual (Just (3))

  expect (Applicative.alt_ (Just (3)) (() => Nothing))
    .toEqual (Just (3))

  expect (Applicative.alt_ (Nothing) (() => Just (2)))
    .toEqual (Just (2))

  expect (Applicative.alt_ (Nothing) (() => Nothing))
    .toEqual (Nothing)
})

test ('altF', () => {
  expect (Applicative.altF (Just (2)) (Just (3)))
    .toEqual (Just (3))

  expect (Applicative.altF (Nothing) (Just (3)))
    .toEqual (Just (3))

  expect (Applicative.altF (Just (2)) (Nothing))
    .toEqual (Just (2))

  expect (Applicative.altF (Nothing) (Nothing))
    .toEqual (Nothing)

  expect (Applicative.altF (List (2)) (List (3)))
    .toEqual (List (3))

  expect (Applicative.altF (List ()) (List (3)))
    .toEqual (List (3))

  expect (Applicative.altF (List (2)) (List ()))
    .toEqual (List (2))

  expect (Applicative.altF (List ()) (List ()))
    .toEqual (List ())
})

test ('altF_', () => {
  expect (Applicative.altF_ (() => Just (2)) (Just (3)))
    .toEqual (Just (3))

  expect (Applicative.altF_ (() => Nothing) (Just (3)))
    .toEqual (Just (3))

  expect (Applicative.altF_ (() => Just (2)) (Nothing))
    .toEqual (Just (2))

  expect (Applicative.altF_ (() => Nothing) (Nothing))
    .toEqual (Nothing)
})

test ('empty', () => {
  expect (Applicative.empty ("Maybe")) .toEqual (Nothing)

  expect (Applicative.empty ("List")) .toEqual (List ())
})

test ('guard', () => {
  expect (Applicative.guard ("Maybe") (true))
    .toEqual (Just (true))

  expect (Applicative.guard ("Maybe") (false))
    .toEqual (Nothing)

  expect (Applicative.guard ("List") (true))
    .toEqual (List (true))

  expect (Applicative.guard ("List") (false))
    .toEqual (List ())
})
