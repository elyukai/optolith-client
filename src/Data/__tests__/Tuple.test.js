// @ts-check
const { Tuple, Pair, bimap, first, second, fst, snd, curry, uncurry, swap, toArray, fromArray, isTuple } = require('../Tuple')

// CONSTRUCTOR

describe ("Tuple ()", () => {
  it ("returns a Pair", () => {
    const pair = Tuple (3, 1)
    expect (pair .values [0]) .toEqual (3)
    expect (pair .values [1]) .toEqual (1)
    expect (pair .length) .toEqual (2)
    expect (pair .isTuple) .toEqual (true)
  })

  it ("returns a Triple", () => {
    const pair = Tuple (3, 1, 2)
    expect (pair .values [0]) .toEqual (3)
    expect (pair .values [1]) .toEqual (1)
    expect (pair .values [2]) .toEqual (2)
    expect (pair .length) .toEqual (3)
    expect (pair .isTuple) .toEqual (true)
  })
})

describe ('Pair x y', () => {
  it ("returns a Pair when curried", () => {
    const pair = Pair (3) (1)
    expect (pair .values [0]) .toEqual (3)
    expect (pair .values [1]) .toEqual (1)
    expect (pair .isTuple) .toEqual (true)
  })

  it ("returns a Pair when not curried", () => {
    const pair = Pair (3, 1)
    expect (pair .values [0]) .toEqual (3)
    expect (pair .values [1]) .toEqual (1)
    expect (pair .isTuple) .toEqual (true)
  })
})

// BIFUNCTOR

describe ("bimap", () => {
  it ("returns a Pair", () => {
    expect (bimap (a => a + 2) (b => b + 3) (Tuple (3, 1)))
      .toEqual (Tuple (5, 4))
  })

  it ("throws if input is not a Pair", () => {
    // @ts-ignore
    expect (() => bimap (a => a + 2) (b => b + 3) (Tuple (3, 1, 2))) .toThrow ()
  })
})

describe ("first", () => {
  it ("returns a Pair", () => {
    expect (first (a => a + 2) (Tuple (3, 1))) .toEqual (Tuple (5, 1))
  })

  it ("throws if input is not a Pair", () => {
    // @ts-ignore
    expect (() => first (a => a + 2) (Tuple (3, 1, 2))) .toThrow ()
  })
})

describe ("second", () => {
  it ("returns a Pair", () => {
    expect (second (b => b + 3) (Tuple (3, 1))) .toEqual (Tuple (3, 4))
  })

  it ("throws if input is not a Pair", () => {
    // @ts-ignore
    expect (() => second (b => b + 3) (Tuple (3, 1, 2))) .toThrow ()
  })
})

// PAIR FUNCTIONS

describe ("fst", () => {
  it ("returns a Pair", () => {
    expect (fst (Tuple (3, 1))) .toEqual (3)
  })

  it ("throws if input is not a Pair", () => {
    // @ts-ignore
    expect (() => fst (Tuple (3, 1, 2))) .toThrow ()
  })
})

describe ("snd", () => {
  it ("returns a Pair", () => {
    expect (snd (Tuple (3, 1))) .toEqual (1)
  })

  it ("throws if input is not a Pair", () => {
    // @ts-ignore
    expect (() => snd (Tuple (3, 1, 2))) .toThrow ()
  })
})

describe ("curry", () => {
  it ("returns a Pair", () => {
    expect (curry (p => fst (p) + snd (p)) (2) (3)) .toEqual (5)
  })
})

describe ("uncurry", () => {
  it ("returns a Pair", () => {
    expect (uncurry (a => b => a + b) (Tuple (2, 3))) .toEqual (5)
  })

  it ("throws if input is not a Pair", () => {
    // @ts-ignore
    expect (() => uncurry (a => b => a + b) (Tuple (2, 3, 4))) .toThrow ()
  })
})

describe ("swap", () => {
  it ("returns a Pair", () => {
    expect (swap (Tuple (3, 1))) .toEqual (Tuple (1, 3))
  })

  it ("throws if input is not a Pair", () => {
    // @ts-ignore
    expect (() => swap (Tuple (3, 1, 2))) .toThrow ()
  })
})

// CUSTOM FUNCTIONS

test ('toArray', () => {
  expect (toArray (Tuple (3, 1))) .toEqual ([3, 1])
})

test ('fromArray', () => {
  expect (fromArray ([3, 1])) .toEqual (Tuple (3, 1))
})

test ('isTuple', () => {
  expect (isTuple (Tuple (3, 1))) .toEqual (true)
  expect (isTuple (2)) .toEqual (false)
})
