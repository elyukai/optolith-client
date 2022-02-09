import { Either, Left, Right } from "../Either"
import { Just, Nothing } from "../Maybe"

describe ("Constructor", () => {
  describe ("Left", () => {
    it ("returns a value wrapped in a Left", () => {
      expect (Left ("Left").value).toBe ("Left")
    })
  })

  describe ("Right", () => {
    it ("returns a value wrapped in a Right", () => {
      expect (Right ("Right").value).toBe ("Right")
    })
  })
})

describe ("map", () => {
  it ("maps a Right value", () => {
    expect (Right ("Right").map (y => `${y}1`)).toEqual (Right ("Right1"))
  })

  it ("returns Left unchanged", () => {
    const x = Left ("Left")
    expect (x.map ()).toBe (x)
  })
})

describe ("bind", () => {
  const f = (y: string) => y.length > 4 ? Right (`${y}1`) : Left (y as never)

  it ("passes a Right value into a function and returns its result", () => {
    expect (Right ("Right").bind (f)).toEqual (Right ("Right1"))
    expect (Right ("Rig").bind (f)).toEqual (Left ("Rig"))
  })

  it ("returns Left unchanged", () => {
    const x = Left ("Left")
    expect (x.bind ()).toBe (x)
  })
})

describe ("isLeft", () => {
  it ("returns true on a Left", () => {
    expect (Left ("Left").isLeft).toBe (true)
  })

  it ("returns false on a Right", () => {
    expect (Right ("Right").isLeft).toBe (false)
  })
})

describe ("isRight", () => {
  it ("returns false on a Left", () => {
    expect (Left ("Left").isRight).toBe (false)
  })

  it ("returns true on a Right", () => {
    expect (Right ("Right").isRight).toBe (true)
  })
})

describe ("toMaybe", () => {
  it ("returns Nothing on a Left", () => {
    expect (Left ("Left").toMaybe ()).toBe (Nothing)
  })

  it ("returns a Just of a Right value", () => {
    expect (Right ("Right").toMaybe ()).toEqual (Just ("Right"))
  })
})

describe ("first", () => {
  const f = (y: string) => `${y}1`

  it ("maps a Left value", () => {
    expect (Left ("Left").first (f)).toEqual (Left ("Left1"))
  })

  it ("returns Right unchanged", () => {
    const x = Right ("Right")
    expect (x.first ()).toBe (x)
  })
})

describe ("second", () => {
  it ("maps a Right value", () => {
    expect (Right ("Right").second (y => `${y}1`)).toEqual (Right ("Right1"))
  })

  it ("returns Left unchanged", () => {
    const x = Left ("Left")
    expect (x.second ()).toBe (x)
  })
})

describe ("bimap", () => {
  const f = (x: Either<string, number>) => x.bimap (y => `${y}1`, y => y + 1)

  it ("maps a Right value using the second function", () => {
    expect (f (Right (5))).toEqual (Right (6))
  })

  it ("maps a Left value using the first function", () => {
    expect (f (Left ("Left"))).toEqual (Left ("Left1"))
  })
})

describe ("either", () => {
  const f = (x: Either<string, number>) => x.either (y => `${y}1`, y => y.toString ())

  it ("maps a Right value using the second function", () => {
    expect (f (Right (5))).toEqual ("5")
  })

  it ("maps a Left value using the first function", () => {
    expect (f (Left ("Left"))).toEqual ("Left1")
  })
})

describe ("Array Prototype Extensions", () => {
  describe ("mapE", () => {
    it ("maps the function over the values and returns a Right of the array if the function returned Rights for all values, otherwise the first Left value", () => {
      const f = (x: number) => x > 0 ? Right (x * 2) : Left (x.toString ())
      expect ([ 1, 2, 3, 4 ].mapE (f)).toEqual (Right ([ 2, 4, 6, 8 ]))
      expect ([ 0, -1, 2, 3 ].mapE (f)).toEqual (Left ("0"))
    })
  })
})
