// @ts-check
const { Internals } = require('../Internals');
const { ident, on } = require('../Function');
const { fmap } = require('../Functor');
const { List } = require('../List');
const { equals } = require('../Eq');
const { Pair, Tuple } = require('../Tuple');
const { OrderedSet } = require('../OrderedSet');
const IntMap = require('../IntMap');
const { Maybe } = require('../Maybe');
const { show } = require('../Show');
const { pipe } = require('../../App/Utilities/pipe');

const Just = Internals.Just
const Nothing = Internals.Nothing

const from1to5 = IntMap.fromListN ([[1, 'a'], [2, 'b'], [4, 'd'], [3, 'c'], [5, 'e']])

test ('internal equals', () => {
  const t1 = IntMap.fromListN ([[1, 'a'],
                                [2, 'b'],
                                [3, 'c'],
                                [4, 'd'],
                                [5, 'e'],
                                [6, 'f'],
                                [7, 'g'],
                                [8, 'h'],
                                [9, 'i'],
                                [10, 'j'],
                                [11, 'k']])

  const t2 = IntMap.fromListN ([[9, 'i'],
                                [5, 'e'],
                                [8, 'h'],
                                [2, 'b'],
                                [11, 'k'],
                                [4, 'd'],
                                [10, 'j'],
                                [1, 'a'],
                                [6, 'f'],
                                [3, 'c'],
                                [7, 'g']])

  expect (equals (t1) (t2)) .toBeTruthy ()
})

describe ("Foldable", () => {
  describe ("Specialized folds", () => {
    test ('all', () => {
      expect (IntMap.all (x => x < "f") (from1to5)) .toBeTruthy ()
      expect (IntMap.all (x => x < "e") (from1to5)) .toBeFalsy ()
    })
  })
})

describe ("Query", () => {
  test ('size', () => {
    expect (IntMap.size (from1to5)) .toEqual (5)
    expect (IntMap.size (IntMap.fromListN ([]))) .toEqual (0)
  })

  test ('member', () => {
    expect (IntMap.member (2) (from1to5))
      .toBeTruthy ()

    expect (IntMap.member (6) (from1to5))
      .toBeFalsy ()
  })

  test ('member_', () => {
    expect (IntMap.memberF (from1to5) (2))
      .toBeTruthy ()

    expect (IntMap.memberF (from1to5) (8))
      .toBeFalsy ()
  })

  test ('notMember', () => {
    expect (IntMap.notMember (2) (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
      .toBeFalsy ()

    expect (IntMap.notMember (5) (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
      .toBeTruthy ()
  })

  test ('lookup', () => {
    expect (IntMap.lookup (2) (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
      .toEqual (Just ('b'))

    expect (IntMap.lookup (5) (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
      .toEqual (Nothing)
  })

  test ('lookupF', () => {
    expect (IntMap.lookupF (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])) (2))
      .toEqual (Just ('b'))

    expect (IntMap.lookupF (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])) (5))
      .toEqual (Nothing)
  })

  test ('findWithDefault', () => {
    expect (
      IntMap.findWithDefault ('...')
                             (2)
                             (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']]))
    )
      .toEqual ('b')

    expect (
      IntMap.findWithDefault ('...')
                             (5)
                             (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']]))
    )
      .toEqual ('...')
  })
})

describe ("Construction", () => {
  test ('empty', () => {
    const map = IntMap.empty
    const res = IntMap.fromListN ([])

    expect (map) .toEqual (res)
  })

  test ('singleton', () => {
    const res = IntMap.fromListN ([[1, 'a']])

    expect (IntMap.singleton (1) ('a')) .toEqual (res)
  })
})

describe ("Insertion", () => {
  test ('insert', () => {
    expect (IntMap.insert (4)
                          ('d')
                          (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
      .toEqual (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]))

    expect (IntMap.insert (3)
                          ('d')
                          (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
      .toEqual (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'd']]))
  })

  test ('insertWith', () => {
    expect (IntMap.insertWith (x => old => old + x)
                                  (4)
                                  ('d')
                                  (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
      .toEqual(IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]))

    expect (IntMap.insertWith (x => old => old + x)
                                  (3)
                                  ('d')
                                  (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
      .toEqual(IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'cd']]))
  })

  test ('insertWithKey', () => {
    expect (
      IntMap.insertWithKey (key => x => old => old + x + key)
                               (4)
                               ('d')
                               (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']]))

    )
      .toEqual (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]))

    expect (
      IntMap.insertWithKey (key => x => old => old + x + key)
                               (3)
                               ('d')
                               (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']]))

    )
      .toEqual (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'cd3']]))
  })

  test ('insertLookupWithKey', () => {
    expect (
      IntMap.insertLookupWithKey (key => x => old => old + x + key)
                                     (4)
                                     ('d')
                                     (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']]))
    )
      .toEqual (
        Pair (Nothing) (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]))
      )

    expect (
      IntMap.insertLookupWithKey (key => x => old => old + x + key)
                                     (3)
                                     ('d')
                                     (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']]))
    )
      .toEqual (
        Pair (Just ('c')) (IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'cd3']]))
      )
  })
})

describe ("Delete/Update", () => {
  test ('sdelete', () => {
    const map = IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])

    expect (equals (IntMap.sdelete (3) (map)) (IntMap.fromListN ([[1, 'a'], [2, 'b']])))
      .toBeTruthy ()

    expect (IntMap.sdelete (4) (map) === map)
      .toBeTruthy ()
  })
})

describe ("Map", () => {
  test ('map', () => {
    const map = IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])
    const res = IntMap.fromListN ([[1, 'a_'], [2, 'b_'], [3, 'c_']])

    expect (IntMap.map (x => x + '_') (map)) .toEqual (res)
  })
})

describe ("Lists", () => {
  test ('fromList', () => {
    const map = List (
      Pair (1) ('a'),
      Pair (3) ('c'),
      Pair (2) ('b')
    )
    const res = IntMap.fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])

    expect (IntMap.fromList (map)) .toEqual (res)
  })

  test ('fromListN', () => {
    const map = List (
      Pair (1) ('a'),
      Pair (3) ('c'),
      Pair (2) ('b')
    )

    const res = Internals.Bin (3)
                              (2)
                              (2)
                              ("b")
                              (Internals.Bin (1) (1) (1) ("a") (Internals.Tip) (Internals.Tip))
                              (Internals.Bin (1) (1) (3) ("c") (Internals.Tip) (Internals.Tip))

    expect (IntMap.fromList (map)) .toEqual (res)
  })
})
