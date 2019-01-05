const { equals } = require('../Eq');
const { Left, Right } = require('../Either');
const { fromElements } = require('../List');
const { fromBoth } = require('../Pair');
const { fromUniqueElements } = require('../OrderedSet');
const { fromUniquePairs } = require('../OrderedMap');
const { Just, Nothing } = require('../Maybe');
const { fromDefault } = require('../Record');

test ('Maybe', () => {
  expect (equals (Just (2)) (Just (2))) .toEqual (true)
  expect (equals (Just (2)) (Just (3))) .toEqual (false)
  expect (equals (Just (2)) (Nothing)) .toEqual (false)
  expect (equals (Nothing) (Just (2))) .toEqual (false)
  expect (equals (Nothing) (Nothing)) .toEqual (true)
})

test ('Either', () => {
  expect (equals (Right (2)) (Right (2))) .toEqual (true)
  expect (equals (Left (2)) (Left (2))) .toEqual (true)
  expect (equals (Left (2)) (Right (2))) .toEqual (false)
  expect (equals (Right (2)) (Right (3))) .toEqual (false)
  expect (equals (Left (2)) (Left (3))) .toEqual (false)
})

test ('List', () => {
  expect (equals (fromElements (2)) (fromElements (2))) .toEqual (true)
  expect (equals (fromElements (2)) (fromElements (3))) .toEqual (false)
  expect (equals (fromElements (2)) (fromElements (2, 3))) .toEqual (false)
  expect (equals (fromElements (2, 3)) (fromElements (2, 3))) .toEqual (true)
})

test ('Pair', () => {
  expect (equals (fromBoth (2) ('text')) (fromBoth (2) ('text'))) .toEqual (true)
  expect (equals (fromBoth (2) ('text')) (fromBoth (3) ('text'))) .toEqual (false)
})

test ('OrderedSet', () => {
  expect (equals (fromUniqueElements (2, 3)) (fromUniqueElements (2, 3))) .toEqual (true)
  expect (equals (fromUniqueElements (2, 3)) (fromUniqueElements (3, 2))) .toEqual (false)
})

test ('OrderedMap', () => {
  expect (equals (fromUniquePairs (['x', 1], ['y', 2], ['z', 3]))
                 (fromUniquePairs (['x', 1], ['y', 2], ['z', 3]))) .toEqual (true)

  expect (equals (fromUniquePairs (['x', 1], ['y', 2], ['z', 3]))
                 (fromUniquePairs (['x', 1], ['z', 3], ['y', 2]))) .toEqual (false)

  expect (equals (fromUniquePairs (['x', 1], ['y', 2], ['z', 3]))
                 (fromUniquePairs (['x', 1], ['y', 2], ['a', 3]))) .toEqual (false)

  expect (equals (fromUniquePairs (['x', 1], ['y', 2], ['z', 3]))
                 (fromUniquePairs (['x', 1], ['y', 2], ['z', 4]))) .toEqual (false)
})

test ('Record', () => {
  const creator1 = fromDefault ({ x: 0, y: 0 })
  const creator2 = fromDefault ({ x: 0, y: 0, z: 0 })
  const creator3 = fromDefault ({ x: 0, y: 1 })

  expect (equals (creator1 ({ y: 2 })) (creator2 ({ y: 2 }))) .toEqual (false)
  expect (equals (creator1 ({})) (creator1 ({}))) .toEqual (true)
  expect (equals (creator1 ({})) (creator3 ({ y: 0 }))) .toEqual (true)
  expect (equals (creator1 ({})) (creator3 ({}))) .toEqual (false)
})
