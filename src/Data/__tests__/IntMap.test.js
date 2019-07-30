// @ts-check
const { Internals } = require('../Internals');
const { ident, on } = require('../Function');
const { fmap } = require('../Functor');
const { List } = require('../List');
const { equals } = require('../Eq');
const { Pair, Tuple } = require('../Tuple');
const { OrderedSet } = require('../OrderedSet');
const IntMap = require('../IntMap');
const { fromListN } = require('../IntMap');
const { Maybe } = require('../Maybe');
const { show } = require('../Show');
const { pipe } = require('../../App/Utilities/pipe');

const Just = Internals.Just
const Nothing = Internals.Nothing

const from1to5 = fromListN ([[1, 'a'], [2, 'b'], [4, 'd'], [3, 'c'], [5, 'e']])

const from1to11 = fromListN ([[9, 'i'],
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

test ('internal equals', () => {
  const t1 = fromListN ([[1, 'a'],
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

  // console.log (IntMap.showTree (t1))

  const t2 = fromListN ([[9, 'i'],
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

  // console.log (IntMap.showTree (t2))

  expect (equals (t1) (t2)) .toBeTruthy ()
})

describe ("Foldable", () => {
  test ('foldr', () => {
    expect (IntMap.foldr (e => acc => e + acc)
                         ('l')
                         (from1to11))
      .toEqual ('abcdefghijkl')
  })

  test ('toList', () => {
    expect (IntMap.toList (from1to11))
      .toEqual (
        List (
          'a',
          'b',
          'c',
          'd',
          'e',
          'f',
          'g',
          'h',
          'i',
          'j',
          'k'
        )
      )
  })

  describe ("Specialized folds", () => {
    test ('all', () => {
      expect (IntMap.all (x => x < "f") (from1to5)) .toBeTruthy ()
      expect (IntMap.all (x => x < "e") (from1to5)) .toBeFalsy ()
    })
  })
})

describe ("Query", () => {
  test ('fnull', () => {
    expect (IntMap.fnull (fromListN ([[1, 'a'], [2, 'b'], [4, 'd']])))
      .toBeFalsy ()

    expect (IntMap.fnull (fromListN ([]))) .toBeTruthy ()
  })

  test ('size', () => {
    expect (IntMap.size (from1to5)) .toEqual (5)
    expect (IntMap.size (fromListN ([]))) .toEqual (0)
  })

  test ('member', () => {
    expect (IntMap.member (2) (from1to5))
      .toBeTruthy ()

    expect (IntMap.member (6) (from1to5))
      .toBeFalsy ()
  })

  test ('memberF', () => {
    expect (IntMap.memberF (from1to5) (2))
      .toBeTruthy ()

    expect (IntMap.memberF (from1to5) (8))
      .toBeFalsy ()
  })

  test ('notMember', () => {
    expect (IntMap.notMember (2) (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
      .toBeFalsy ()

    expect (IntMap.notMember (5) (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
      .toBeTruthy ()
  })

  test ('notMemberF', () => {
    expect (IntMap.notMemberF (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])) (2))
      .toBeFalsy ()

    expect (IntMap.notMemberF (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])) (5))
      .toBeTruthy ()
  })

  test ('lookup', () => {
    expect (IntMap.lookup (2) (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
      .toEqual (Just ('b'))

    expect (IntMap.lookup (5) (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
      .toEqual (Nothing)
  })

  test ('lookupF', () => {
    expect (IntMap.lookupF (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])) (2))
      .toEqual (Just ('b'))

    expect (IntMap.lookupF (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])) (5))
      .toEqual (Nothing)
  })

  test ('findWithDefault', () => {
    expect (
      IntMap.findWithDefault ('...')
                             (2)
                             (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']]))
    )
      .toEqual ('b')

    expect (
      IntMap.findWithDefault ('...')
                             (5)
                             (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']]))
    )
      .toEqual ('...')
  })
})

describe ("Construction", () => {
  test ('empty', () => {
    const map = IntMap.empty
    const res = fromListN ([])

    expect (map) .toEqual (res)
  })

  test ('singleton', () => {
    const res = fromListN ([[1, 'a']])

    expect (IntMap.singleton (1) ('a')) .toEqual (res)
  })
})

describe ("Insertion", () => {
  test ('insert', () => {
    expect (equals (IntMap.insert (4)
                                  ('d')
                                  (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
                   (fromListN ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']])))
      .toBeTruthy ()

    expect (equals (IntMap.insert (3)
                                  ('d')
                                  (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
                   (fromListN ([[1, 'a'], [2, 'b'], [3, 'd']])))
      .toBeTruthy ()
  })

  test ('insertWith', () => {
    expect (equals (IntMap.insertWith (x => old => old + x)
                                      (4)
                                      ('d')
                                      (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
                   (fromListN ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']])))
      .toBeTruthy ()

    expect (equals (IntMap.insertWith (x => old => old + x)
                                      (3)
                                      ('d')
                                      (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
                   (fromListN ([[1, 'a'], [2, 'b'], [3, 'cd']])))
      .toBeTruthy ()
  })

  test ('insertWithKey', () => {
    expect (
      equals (IntMap.insertWithKey (key => x => old => old + x + key)
                                   (4)
                                   ('d')
                                   (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
             (fromListN ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']]))
    )
      .toBeTruthy ()

    expect (
      equals (IntMap.insertWithKey (key => x => old => old + x + key)
                                   (3)
                                   ('d')
                                   (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
             (fromListN ([[1, 'a'], [2, 'b'], [3, 'cd3']]))
    )
      .toBeTruthy ()
  })

  test ('insertLookupWithKey', () => {
    expect (
      equals (IntMap.insertLookupWithKey (key => x => old => old + x + key)
                                         (4)
                                         ('d')
                                         (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
             (Pair (Nothing, fromListN ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']])))
    )
      .toBeTruthy ()

    expect (
      equals (IntMap.insertLookupWithKey (key => x => old => old + x + key)
                                         (3)
                                         ('d')
                                         (fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])))
             (Pair (Just ('c'), fromListN ([[1, 'a'], [2, 'b'], [3, 'cd3']])))
    )
      .toBeTruthy ()
  })
})

describe ("Delete/Update", () => {
  test ('sdelete', () => {
    const map = fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])

    expect (equals (IntMap.sdelete (3) (map)) (fromListN ([[1, 'a'], [2, 'b']])))
      .toBeTruthy ()

    expect (IntMap.sdelete (4) (map) === map)
      .toBeTruthy ()
  })

  test ('adjust', () => {
    const map = fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])

    expect (equals (IntMap.adjust (x => x + 'd') (3) (map))
                   (fromListN ([[1, 'a'], [2, 'b'], [3, 'cd']])))
      .toBeTruthy ()

    expect (IntMap.adjust (x => x + 'd') (4) (map) === map)
      .toBeTruthy ()
  })

  test ('adjustWithKey', () => {
    const map = fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])

    expect (equals (IntMap.adjustWithKey (key => x => x + key) (3) (map))
                   (fromListN ([[1, 'a'], [2, 'b'], [3, 'c3']])))
      .toBeTruthy ()

    expect (IntMap.adjustWithKey (key => x => x + key) (4) (map) === map)
      .toBeTruthy ()
  })

  test ('update', () => {
    const map = fromListN ([[1, 'a'],[2, 'b'],[3, 'c']])

    expect (equals (IntMap.update (x => Just (x + 'd')) (3) (map))
                   (fromListN ([[1, 'a'], [2, 'b'], [3, 'cd']])))
      .toBeTruthy ()

    expect (equals (IntMap.update (x => Nothing) (3) (map))
                   (fromListN ([[1, 'a'], [2, 'b']])))
      .toBeTruthy ()

    expect (IntMap.update (x => Just (x + 'd')) (4) (map) === map)
      .toBeTruthy ()

    expect (IntMap.update (x => Nothing) (4) (map) === map)
      .toBeTruthy ()
  })

  test ('updateWithKey', () => {
    const map = fromListN ([[1, 'a'],[2, 'b'],[3, 'c']])

    expect (equals (IntMap.updateWithKey (key => x => Just (x + key)) (3) (map))
                   (fromListN ([[1, 'a'], [2, 'b'], [3, 'c3']])))
      .toBeTruthy ()

    expect (equals (IntMap.updateWithKey (key => x => Nothing) (3) (map))
                   (fromListN ([[1, 'a'], [2, 'b']])))
      .toBeTruthy ()

    expect (IntMap.updateWithKey (key => x => Just (x + key))
                                 (4)
                                 (map) === map)
      .toBeTruthy ()

    expect (IntMap.updateWithKey (key => x => Nothing) (4) (map) === map)
      .toBeTruthy ()
  })

  test ('updateLookupWithKey', () => {
    const map = fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])

    expect (equals (IntMap.updateLookupWithKey (key => x => Just (x + key)) (3) (map))
                   (Pair (Just ('c'), (fromListN ([[1, 'a'], [2, 'b'], [3, 'c3']])))))
      .toBeTruthy ()

    expect (equals (IntMap.updateLookupWithKey (key => x => Nothing) (3) (map))
                   (Pair (Just ('c'), fromListN ([[1, 'a'], [2, 'b']]))))
      .toBeTruthy ()

    expect (Tuple.snd (IntMap.updateLookupWithKey (key => x => Just (x + key))
                                                  (4)
                                                  (map)) === map)
      .toBeTruthy()

    expect (Tuple.snd (IntMap.updateLookupWithKey (key => x => Nothing)
                                                  (4)
                                                  (map)) === map)
      .toBeTruthy()
  })

  test ('alter', () => {
    const map = fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])

    // Update
    expect (equals (IntMap.alter (fmap (x => x + 'd')) (3) (map))
                   (fromListN ([[1, 'a'], [2, 'b'], [3, 'cd']])))
      .toBeTruthy ()

    // Insert
    expect (equals (IntMap.alter (pipe (fmap (ident), Maybe.altF (Just ('d')))) (4) (map))
                   (fromListN ([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd']])))
      .toBeTruthy ()

    // Delete
    expect (equals (IntMap.alter (m => Nothing) (3) (map))
                   (fromListN ([[1, 'a'], [2, 'b']])))
      .toBeTruthy ()
  })
})

describe ("Map", () => {
  test ('map', () => {
    const map = fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])
    const res = fromListN ([[1, 'a_'], [2, 'b_'], [3, 'c_']])

    expect (equals (IntMap.map (x => x + '_') (map)) (res))
      .toBeTruthy ()
  })

  test ('mapWithKey', () => {
    const map = fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])
    const res = fromListN ([[1, 'a1'], [2, 'b2'], [3, 'c3']])

    expect (equals (IntMap.mapWithKey (key => x => x + key) (map)) (res))
      .toBeTruthy ()
  })
})

describe ("Folds", () => {
  test ('foldrWithKey', () => {
    const map = fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])
    const res = 'c3b2a1'

    expect (equals (IntMap.foldrWithKey (key => x => acc => acc + x + key) ('') (map))
                   (res))
      .toBeTruthy ()
  })
})

describe ("Conversion", () => {
  test ('elems', () => {
    const map = fromListN ([[1, 'a'], [3, 'c'], [2, 'b']])
    const res = List ('a', 'b', 'c')

    expect (IntMap.elems (map)) .toEqual (res)
  })

  test ('keys', () => {
    const map = fromListN ([[1, 'a'], [3, 'c'], [2, 'b']])
    const res = List (1, 2, 3)

    expect (IntMap.keys (map)) .toEqual (res)
  })

  test ('assocs', () => {
    const map = fromListN ([[1, 'a'], [3, 'c'], [2, 'b']])
    const res = List (
      Pair (1, 'a'),
      Pair (2, 'b'),
      Pair (3, 'c')
    )

    expect (IntMap.assocs (map)) .toEqual (res)
  })
})

describe ("Lists", () => {
  test ('fromList', () => {
    const map = List (
      Pair (1) ('a'),
      Pair (3) ('c'),
      Pair (2) ('b')
    )
    const res = fromListN ([[1, 'a'], [2, 'b'], [3, 'c']])

    expect (equals (IntMap.fromList (map)) (res)) .toBeTruthy ()
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
