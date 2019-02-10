// @ts-check
const { Left, Right } = require ('../../Data/Either');
const { List } = require ('../../Data/List');
const { Just, Maybe, Nothing } = require ('../../Data/Maybe');
const { empty } = require ('../Applicative');
const Monad = require ('../Monad');

test ('bind', () => {
  expect (Monad.bind (Left (3))
                     (x => Right (x * 2)))
    .toEqual (Left (3))

  expect (Monad.bind (Right (2))
                     (x => Right (x * 2)))
    .toEqual (Right (4))

  expect (Monad.bind (Right (2))
                     (x => Left (x * 2)))
    .toEqual (Left (4))

  expect (Monad.bind (List (1, 2, 3, 4, 5))
                     (e => List (e, e)))
    .toEqual (List (1, 1, 2, 2, 3, 3, 4, 4, 5, 5))

  expect (Monad.bind (Maybe (3))
                     (x => Just (x * 2)))
    .toEqual (Just (6))

  expect (Monad.bind (Maybe (null))
                     (x => Just (x * 2)))
    .toEqual (Nothing)
})

test ('bindF', () => {
  expect (Monad.bindF (x => Right (x * 2))
                      (Left (3)))
    .toEqual (Left (3))

  expect (Monad.bindF (x => Right (x * 2))
                      (Right (2)))
    .toEqual (Right (4))

  expect (Monad.bindF (x => Left (x * 2))
                      (Right (2)))
    .toEqual (Left (4))

  expect (Monad.bindF (e => List (e, e))
                      (List (1, 2, 3, 4, 5)))
    .toEqual (List (1, 1, 2, 2, 3, 3, 4, 4, 5, 5))

  expect (Monad.bindF (x => Just (x * 2))
                      (Maybe (3)))
    .toEqual (Just (6))

  expect (Monad.bindF (x => Just (x * 2))
                      (Maybe (null)))
    .toEqual (Nothing)
})

test ('then', () => {
  expect (Monad.then (Right (3)) (Right (2)))
    .toEqual (Right (2))

  expect (Monad.then (Left ('a')) (Right (2)))
    .toEqual (Left ('a'))

  expect (Monad.then (Right (3)) (Left ('b')))
    .toEqual (Left ('b'))

  expect (Monad.then (Left ('a')) (Left ('b')))
    .toEqual (Left ('a'))

  expect (Monad.then (List (1, 2, 3, 4, 5))
                    (List ('a', 'c')))
    .toEqual (List ('a', 'c', 'a', 'c', 'a', 'c', 'a', 'c', 'a', 'c'))

  expect (Monad.then (List ()) (List ('a', 'c')))
    .toEqual (List ())

  expect (Monad.then (Just (3)) (Just (2)))
    .toEqual (Just (2))

  expect (Monad.then (Nothing) (Maybe.Just (2)))
    .toEqual (Nothing)

  expect (Monad.then (Just (3)) (Nothing))
    .toEqual (Nothing)

  expect (Monad.then (Nothing) (Nothing))
    .toEqual (Nothing)
})

test ('kleisli', () => {
  expect (Monad.kleisli (x => x > 5 ? Left ('too large') : Right (x))
                        (x => x < 0 ? Left ('too low') : Right (x))
                        (2))
    .toEqual (Right (2))

  expect (Monad.kleisli (x => x > 5 ? Left ('too large') : Right (x))
                        (x => x < 0 ? Left ('too low') : Right (x))
                        (6))
    .toEqual (Left ('too large'))

  expect (Monad.kleisli (x => x > 5 ? Left ('too large') : Right (x))
                        (x => x < 0 ? Left ('too low') : Right (x))
                        (-1))
    .toEqual (Left ('too low'))

  expect (Monad.kleisli (e => List (e, e))
                        (e => List (e, e * 2))
                        (2))
    .toEqual (List (2, 4, 2, 4))

  expect (Monad.kleisli (x => x > 5 ? Nothing : Just (x))
                        (x => x < 0 ? Nothing : Just (x))
                        (2))
    .toEqual (Just (2))

  expect (Monad.kleisli (x => x > 5 ? Nothing : Just (x))
                        (x => x < 0 ? Nothing : Just (x))
                        (6))
    .toEqual (Nothing)

  expect (Monad.kleisli (x => x > 5 ? Nothing : Just (x))
                        (x => x < 0 ? Nothing : Just (x))
                        (-1))
    .toEqual (Nothing)
})

test ('join', () => {
  expect (Monad.join (Right (Right (3))))
    .toEqual (Right (3))

  expect (Monad.join (Right (Left ('test'))))
    .toEqual (Left ('test'))

  expect (Monad.join (Left (Left ('test'))))
    .toEqual (Left (Left ('test')))

  expect (Monad.join (
    List (
      List (3),
      List (2),
      List (1)
    )
  ))
    .toEqual (List (3, 2, 1))

  expect (Monad.join (Just (Just (3))))
    .toEqual (Just (3))

  expect (Monad.join (Just (Nothing)))
    .toEqual (Nothing)

  expect (Monad.join (Nothing))
    .toEqual (Nothing)
})

test ('mapM', () => {
  expect (
    Monad.mapM ("Either")
               (x => x === 2 ? Left ("test") : Right (x + 1))
               (empty ("List"))
  )
    .toEqual (Right (empty ("List")))

  expect (
    Monad.mapM ("Either")
               (x => x === 2 ? Left ("test") : Right (x + 1))
               (List (1, 3))
  )
    .toEqual (Right (List (2, 4)))

  expect (
    Monad.mapM ("Either")
               (x => x === 2 ? Left ("test") : Right (x + 1))
               (List (1, 2, 3))
  )
    .toEqual (Left ("test"))

  expect (
    Monad.mapM ("Maybe")
               (x => x === 2 ? Nothing : Just (x + 1))
               (empty ("List"))
  )
    .toEqual (Just (empty ("List")))

  expect (
    Monad.mapM ("Maybe")
               (x => x === 2 ? Nothing : Just (x + 1))
               (List (1, 3))
  )
    .toEqual (Just (List (2, 4)))

  expect (
    Monad.mapM ("Maybe")
               (x => x === 2 ? Nothing : Just (x + 1))
               (List (1, 2, 3))
  )
    .toEqual (Nothing)
})

test ('sequence', () => {
  expect (
    Monad.sequence ("Either")
                   (empty ("List"))
  )
    .toEqual (Right (empty ("List")))

  expect (
    Monad.sequence ("Either")
                   (List (Right (1), Right (3)))
  )
    .toEqual (Right (List (1, 3)))

  expect (
    Monad.sequence ("Either")
                   // @ts-ignore
                   (List (Right (1), Left ("test"), Right (2)))
  )
    .toEqual (Left ("test"))

  expect (
    Monad.sequence ("Maybe")
                   (empty ("List"))
  )
    .toEqual (Just (empty ("List")))

  expect (
    Monad.sequence ("Maybe")
                   (List (Just (1), Just (3)))
  )
    .toEqual (Just (List (1, 3)))

  expect (
    Monad.sequence ("Maybe")
                   // @ts-ignore
                   (List (Just (1), Just (2), Nothing, Just (3)))
  )
    .toEqual (Nothing)
})

test ('liftM2', () => {
  expect (Monad.liftM2 (x => y => x + y) (Right (1)) (Right (2))) .toEqual (Right (3))

  expect (Monad.liftM2 (x => y => x + y) (Left ("x")) (Right (2))) .toEqual (Left ("x"))

  expect (Monad.liftM2 (x => y => x + y) (Right (1)) (Left ("y"))) .toEqual (Left ("y"))

  expect (Monad.liftM2 (x => y => x + y) (Left ("x")) (Left ("y"))) .toEqual (Left ("x"))

  expect (Monad.liftM2 (x => y => x + y) (Just (1)) (Just (2))) .toEqual (Just (3))

  expect (Monad.liftM2 (x => y => x + y) (Nothing) (Just (2))) .toEqual (Nothing)

  expect (Monad.liftM2 (x => y => x + y) (Just (1)) (Nothing)) .toEqual (Nothing)

  expect (Monad.liftM2 (x => y => x + y) (Nothing) (Nothing)) .toEqual (Nothing)
})

test ('liftM3', () => {
  expect (
    Monad.liftM3 (x => y => z => x + y + z)
                  (Just (1))
                  (Just (2))
                  (Just (3))
  )
    .toEqual (Just (6))

  expect (
    Monad.liftM3 (x => y => z => x + y + z)
                  (Nothing)
                  (Just (2))
                  (Just (3))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM3 (x => y => z => x + y + z)
                  (Just (1))
                  (Nothing)
                  (Just (3))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM3 (x => y => z => x + y + z)
                  (Just (1))
                  (Just (2))
                  (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM3 (x => y => z => x + y + z)
                  (Just (1))
                  (Nothing)
                  (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM3 (x => y => z => x + y + z)
                  (Nothing)
                  (Just (2))
                  (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM3 (x => y => z => x + y + z)
                  (Nothing)
                  (Nothing)
                  (Just (3))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM3 (x => y => z => x + y + z)
                  (Nothing)
                  (Nothing)
                  (Nothing)
  )
    .toEqual (Nothing)
})

test ('liftM4', () => {
  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Just (2)) (Just (3)) (Just (4))
  )
    .toEqual (Just (10))

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Just (2)) (Just (3)) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Nothing) (Just (3)) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Just (2)) (Nothing) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Just (2)) (Just (3)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Just (2)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Nothing) (Just (3)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Nothing) (Nothing) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Just (2)) (Just (3)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Just (2)) (Nothing) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Nothing) (Just (3)) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Just (1)) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Just (2)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Nothing) (Just (3)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Nothing) (Nothing) (Just (4))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM4 (x => y => z => a => x + y + z + a)
                 (Nothing) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)
})

test ('liftM5', () => {
  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Just (2)) (Just (3)) (Just (4)) (Just (5))
  )
    .toEqual (Just (15))

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Nothing) (Just (2)) (Just (3)) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Nothing) (Just (3)) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Just (2)) (Nothing) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Just (2)) (Just (3)) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Just (2)) (Just (3)) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Just (2)) (Just (3)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                 (Just (1)) (Just (2)) (Nothing) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Just (3)) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Just (2)) (Just (3)) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Just (2)) (Nothing) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Just (3)) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Just (2)) (Just (3)) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Nothing) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Just (2)) (Nothing) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Nothing) (Just (4)) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Just (3)) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Just (3)) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Nothing) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Nothing) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Just (2)) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Just (3)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Just (2)) (Just (3)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Just (2)) (Nothing) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Just (1)) (Nothing) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Just (2)) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Just (3)) (Nothing) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Nothing) (Just (4)) (Nothing)
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Nothing) (Nothing) (Just (5))
  )
    .toEqual (Nothing)

  expect (
    Monad.liftM5 (x => y => z => a => b => x + y + z + a + b)
                  (Nothing) (Nothing) (Nothing) (Nothing) (Nothing)
  )
    .toEqual (Nothing)
})
