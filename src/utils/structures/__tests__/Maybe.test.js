const React = require('react');
const List = require('../List');
const Maybe = require('../Maybe');
const { add } = require('../../mathUtils');
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

test ('fromNullable', () => {
  expect (Maybe.fromNullable (3)) .toEqual (Just (3))
  expect (Maybe.fromNullable (undefined)) .toEqual (Nothing)
  expect (Maybe.fromNullable (null)) .toEqual (Nothing)
})

// MAYBE FUNCTIONS (PART 1)

test ('isJust', () => {
  expect (Maybe.isJust (Maybe.fromNullable (3)))
    .toBeTruthy ()
  expect (Maybe.isJust (Maybe.fromNullable (null)))
    .toBeFalsy ()
})

test ('isNothing', () => {
  expect (Maybe.isNothing (Maybe.fromNullable (3)))
    .toBeFalsy ()
  expect (Maybe.isNothing (Maybe.fromNullable (null)))
    .toBeTruthy ()
})

test ('fromJust', () => {
  expect (Maybe.fromJust (Maybe.fromNullable (3)))
    .toEqual (3)
  expect (() => Maybe.fromJust (Maybe.fromNullable (null)))
    .toThrow ()
})

test ('fromMaybe', () => {
  expect (Maybe.fromMaybe (0) (Maybe.fromNullable (3)))
    .toEqual (3)
  expect (Maybe.fromMaybe (0) (Maybe.fromNullable (null)))
    .toEqual (0)
})

// FUNCTOR

test ('fmap', () => {
  expect (Maybe.fmap (x => x * 2) (Just (3)))
    .toEqual (Just (6))
  expect (Maybe.fmap (x => x * 2) (Nothing))
    .toEqual (Nothing)
})

test ('mapReplace', () => {
  expect (Maybe.mapReplace (2) (Just (3)))
    .toEqual (Just (2))
  expect (Maybe.mapReplace (2) (Nothing))
    .toEqual (Nothing)
})

// APPLICATIVE

test ('pure', () => {
  expect (Maybe.pure (2)) .toEqual (Just (2))
})

test ('ap', () => {
  expect (Maybe.ap (Just (x => x * 2)) (Just (3)))
    .toEqual (Just (6))
  expect (Maybe.ap (Just (x => x * 2)) (Nothing))
    .toEqual (Nothing)
  expect (Maybe.ap (Nothing) (Just (3)))
    .toEqual (Nothing)
  expect (Maybe.ap (Nothing) (Nothing))
    .toEqual (Nothing)
})

// ALTERNATIVE

test ('alt', () => {
  expect (Maybe.alt (Just (3)) (Just (2)))
    .toEqual (Just (3))
  expect (Maybe.alt (Just (3)) (Nothing))
    .toEqual (Just (3))
  expect (Maybe.alt (Nothing) (Just (2)))
    .toEqual (Just (2))
  expect (Maybe.alt (Nothing) (Nothing))
    .toEqual (Nothing)
})

test ('alt_', () => {
  expect (Maybe.alt_ (Just (2)) (Just (3)))
    .toEqual (Just (3))
  expect (Maybe.alt_ (Nothing) (Just (3)))
    .toEqual (Just (3))
  expect (Maybe.alt_ (Just (2)) (Nothing))
    .toEqual (Just (2))
  expect (Maybe.alt_ (Nothing) (Nothing))
    .toEqual (Nothing)
})

test ('empty', () => {
  expect (Maybe.empty) .toEqual (Nothing)
})

test ('guard', () => {
  expect (Maybe.guard (true))
    .toEqual (Just (true))
  expect (Maybe.guard (false))
    .toEqual (Nothing)
})

// MONAD

test ('bind', () => {
  expect (Maybe.bind (Maybe.fromNullable (3))
                     (x => Just (x * 2)))
    .toEqual (Just (6))
  expect (Maybe.bind (Maybe.fromNullable (null))
                     (x => Just (x * 2)))
    .toEqual (Nothing)
})

test ('bind_', () => {
  expect (Maybe.bind_ (x => Just (x * 2))
                      (Maybe.fromNullable (3)))
    .toEqual (Just (6))
  expect (Maybe.bind_ (x => Just (x * 2))
                      (Maybe.fromNullable (null)))
    .toEqual (Nothing)
})

test ('then', () => {
  expect (Maybe.then (Just (3)) (Just (2)))
    .toEqual (Just (2))
  expect (Maybe.then (Nothing) (Maybe.Just (2)))
    .toEqual (Nothing)
  expect (Maybe.then (Just (3)) (Nothing))
    .toEqual (Nothing)
  expect (Maybe.then (Nothing) (Nothing))
    .toEqual (Nothing)
})

test ('mreturn', () => {
  expect (Maybe.mreturn (2)) .toEqual (Just (2))
})

test ('kleisli', () => {
  expect (Maybe.kleisli (x => x > 5 ? Nothing : Just (x)) (x => x < 0 ? Nothing : Just (x)) (2))
    .toEqual (Just (2))
  expect (Maybe.kleisli (x => x > 5 ? Nothing : Just (x)) (x => x < 0 ? Nothing : Just (x)) (6))
    .toEqual (Nothing)
  expect (Maybe.kleisli (x => x > 5 ? Nothing : Just (x)) (x => x < 0 ? Nothing : Just (x)) (-1))
    .toEqual (Nothing)
})

test ('join', () => {
  expect (Maybe.join (Just (Just (3))))
    .toEqual (Just (3))
  expect (Maybe.join (Just (Nothing)))
    .toEqual (Nothing)
  expect (Maybe.join (Nothing))
    .toEqual (Nothing)
})

test ('liftM2', () => {
  expect (Maybe.liftM2 (x => y => x + y) (Just (1)) (Just (2))) .toEqual (Just (3))
  expect (Maybe.liftM2 (x => y => x + y) (Nothing) (Just (2))) .toEqual (Nothing)
  expect (Maybe.liftM2 (x => y => x + y) (Just (1)) (Nothing)) .toEqual (Nothing)
  expect (Maybe.liftM2 (x => y => x + y) (Nothing) (Nothing)) .toEqual (Nothing)
})

test ('liftM3', () => {
  expect (
    Maybe.liftM3 (x => y => z => x + y + z)
                  (Just (1))
                  (Just (2))
                  (Just (3))
  )
    .toEqual (Just (6))

  expect (
    Maybe.liftM3 (x => y => z => x + y + z)
                  (Nothing)
                  (Just (2))
                  (Just (3))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM3 (x => y => z => x + y + z)
                  (Just (1))
                  (Nothing)
                  (Just (3))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM3 (x => y => z => x + y + z)
                  (Just (1))
                  (Just (2))
                  (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM3 (x => y => z => x + y + z)
                  (Just (1))
                  (Nothing)
                  (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM3 (x => y => z => x + y + z)
                  (Nothing)
                  (Just (2))
                  (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM3 (x => y => z => x + y + z)
                  (Nothing)
                  (Nothing)
                  (Just (3))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM3 (x => y => z => x + y + z)
                  (Nothing)
                  (Nothing)
                  (Nothing)
  )
    .toEqual (Nothing)
})

test ('liftM4', () => {
  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Just (2)) (Just (3)) (Just (4))
  )
    .toEqual (Just (10))

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Just (2)) (Just (3)) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Nothing) (Just (3)) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Just (2)) (Nothing) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Just (2)) (Just (3)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Just (2)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Nothing) (Just (3)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Nothing) (Nothing) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Just (2)) (Just (3)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Just (2)) (Nothing) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Nothing) (Just (3)) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Just (2)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Nothing) (Just (3)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Nothing) (Nothing) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)
})

test ('liftM5', () => {
  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Just (2)) (Just (3)) (Just (4)) (Just (5))
  )
    .toEqual (Just (15))

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Nothing) (Just (2)) (Just (3)) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Nothing) (Just (3)) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Just (2)) (Nothing) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Just (2)) (Just (3)) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Just (2)) (Just (3)) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Just (2)) (Just (3)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Just (2)) (Nothing) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Just (3)) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Just (2)) (Just (3)) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Just (2)) (Nothing) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Just (3)) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Just (2)) (Just (3)) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Nothing) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Just (2)) (Nothing) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Nothing) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Just (3)) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Just (3)) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Nothing) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Nothing) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Just (2)) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Just (3)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Just (2)) (Just (3)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Just (2)) (Nothing) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Just (2)) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Just (3)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Nothing) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Nothing) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Maybe.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)
})

// FOLDABLE

test ('foldr', () => {
  expect (Maybe.foldr (x => acc => x * 2 + acc) (2) (Just (3)))
    .toEqual (8)
  expect (Maybe.foldr (x => acc => x * 2 + acc) (2) (Nothing))
    .toEqual (2)
})

test ('foldl', () => {
  expect (Maybe.foldl (acc => x => x * 2 + acc) (2) (Just (3)))
    .toEqual (8)
  expect (Maybe.foldl (acc => x => x * 2 + acc) (2) (Nothing))
    .toEqual (2)
})

test ('toList', () => {
  expect (Maybe.toList (Just (3)))
    .toEqual (List.fromElements (3))
  expect (Maybe.toList (Nothing))
    .toEqual (List.fromElements ())
})

test ('fnull', () => {
  expect (Maybe.fnull (Just (3)))
    .toEqual (false)
  expect (Maybe.fnull (Nothing))
    .toEqual (true)
})

test ('length', () => {
  expect (Maybe.length (Just (3)))
    .toEqual (1)
  expect (Maybe.length (Nothing))
    .toEqual (0)
})

test ('elem', () => {
  expect (Maybe.elem (3) (Nothing))
    .toBeFalsy ()
  expect (Maybe.elem (3) (Just (2)))
    .toBeFalsy ()
  expect (Maybe.elem (3) (Just (3)))
    .toBeTruthy ()
})

test ('elem_', () => {
  expect (Maybe.elem_ (Nothing) (3))
    .toBeFalsy ()
  expect (Maybe.elem_ (Just (2)) (3))
    .toBeFalsy ()
  expect (Maybe.elem_ (Just (3)) (3))
    .toBeTruthy ()
})

test ('sum', () => {
  expect (Maybe.sum (Just (3)))
    .toEqual (3)
  expect (Maybe.sum (Nothing))
    .toEqual (0)
})

test ('product', () => {
  expect (Maybe.product (Just (3)))
    .toEqual (3)
  expect (Maybe.product (Nothing))
    .toEqual (1)
})

test ('concat', () => {
  expect (Maybe.concat (Just (List.fromElements (1, 2, 3))))
    .toEqual (List.fromElements (1, 2, 3))
  expect (Maybe.concat (Nothing))
    .toEqual (List.fromElements ())
})

test ('concatMap', () => {
  expect (Maybe.concatMap (e => List.fromElements (e, e)) (Just (3)))
    .toEqual (List.fromElements (3, 3))
  expect (Maybe.concatMap (e => List.fromElements (e, e)) (Nothing))
    .toEqual (List.fromElements ())
})

test ('and', () => {
  expect (Maybe.and (Just (true)))
    .toEqual (true)
  expect (Maybe.and (Just (false)))
    .toEqual (false)
  expect (Maybe.and (Nothing))
    .toEqual (true)
})

test ('or', () => {
  expect (Maybe.or (Just (true)))
    .toEqual (true)
  expect (Maybe.or (Just (false)))
    .toEqual (false)
  expect (Maybe.or (Nothing))
    .toEqual (false)
})

test ('any', () => {
  expect (Maybe.any (e => e > 3) (Just (5)))
    .toEqual (true)
  expect (Maybe.any (e => e > 3) (Just (3)))
    .toEqual (false)
  expect (Maybe.any (e => e > 3) (Nothing))
    .toEqual (false)
})

test ('all', () => {
  expect (Maybe.all (e => e > 3) (Just (5)))
    .toEqual (true)
  expect (Maybe.all (e => e > 3) (Just (3)))
    .toEqual (false)
  expect (Maybe.all (e => e > 3) (Nothing))
    .toEqual (true)
})

test ('notElem', () => {
  expect (Maybe.notElem (3) (Nothing))
    .toBeTruthy ()
  expect (Maybe.notElem (3) (Just (2)))
    .toBeTruthy ()
  expect (Maybe.notElem (3) (Just (3)))
    .toBeFalsy ()
})

test ('find', () => {
  expect (Maybe.find (e => e > 3) (Just (5)))
    .toEqual (Just (5))
  expect (Maybe.find (e => e > 3) (Just (3)))
    .toEqual (Nothing)
  expect (Maybe.find (e => e > 3) (Nothing))
    .toEqual (Nothing)
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
  expect (Maybe.listToMaybe (List.fromElements (3)))
    .toEqual (Just (3))
  expect (Maybe.listToMaybe (List.fromElements ()))
    .toEqual (Nothing)
})

test ('maybeToList', () => {
  expect (Maybe.maybeToList (Just (3)))
    .toEqual (List.fromElements(3))
  expect (Maybe.maybeToList (Nothing))
    .toEqual (List.fromElements())
})

test ('catMaybes', () => {
  expect (Maybe.catMaybes (List.fromElements (Just (3), Just (2), Nothing, Just (1))))
    .toEqual (List.fromElements (3, 2, 1))
})

test ('mapMaybe', () => {
  expect (Maybe.mapMaybe (Maybe.ensure (x => x > 2)) (List.fromElements(1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (3, 4, 5))
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
  expect (Maybe.imapMaybe (i => e => Maybe.fmap (add (i)) (Maybe.ensure (x => x > 2) (e))) (List.fromElements(1, 2, 3, 4, 5)))
    .toEqual (List.fromElements (5, 7, 9))
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
