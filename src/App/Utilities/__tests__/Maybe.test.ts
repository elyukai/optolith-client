import { ensure, Just, Maybe, Nothing, Nullable } from "../Maybe"

describe ("Constructor", () => {
  describe ("Just", () => {
    it ("returns a value wrapped in a Just", () => {
      expect (Just ("Just")).toEqual (Just ("Just"))
    })
  })

  describe ("Nothing", () => {
    it ("exists only once", () => {
      expect (Nothing).toBe (Nothing)
    })
  })

  describe ("Nullable", () => {
    it ("returns a Just from a non-nullish value", () => {
      expect (Nullable ("Just")).toEqual (Just ("Just"))
      expect (Nullable (null)).toBe (Nothing)
    })

    it ("returns Nothing from a nullish value", () => {
      expect (Nullable (null)).toBe (Nothing)
      expect (Nullable (undefined)).toBe (Nothing)
    })
  })
})

describe ("map", () => {
  it ("maps a Just value", () => {
    expect (Just ("Just").map (y => `${y}1`)).toEqual (Just ("Just1"))
  })

  it ("returns Nothing on Nothing", () => {
    expect (Nothing.map ()).toBe (Nothing)
  })
})

describe ("bind", () => {
  const f = (y: string) => y.length > 3 ? Just (`${y}1`) : Nothing

  it ("passes a Just value into a function and returns its result", () => {
    expect (Just ("Just").bind (f)).toEqual (Just ("Just1"))
    expect (Just ("Ju").bind (f)).toBe (Nothing)
  })

  it ("returns Nothing on Nothing", () => {
    expect (Nothing.bind ()).toBe (Nothing)
  })
})

describe ("fromMaybe", () => {
  it ("returns a Just value", () => {
    expect (Just (5).fromMaybe ()).toBe (5)
  })

  it ("returns the default on Nothing", () => {
    expect (Nothing.fromMaybe (1)).toBe (1)
  })
})

describe ("maybe", () => {
  it ("passes a Just value into a function and returns its result", () => {
    expect (Just (5).maybe (1, x => x + 1)).toBe (6)
  })

  it ("returns the default on Nothing", () => {
    expect (Nothing.maybe (1)).toBe (1)
  })
})

describe ("isNothing", () => {
  it ("returns false on a Just", () => {
    expect (Just ("Just").isNothing).toEqual (false)
  })

  it ("returns true on Just", () => {
    expect (Nothing.isNothing).toBe (true)
  })
})

describe ("isJust", () => {
  it ("returns true on a Just", () => {
    expect (Just ("Just").isJust).toEqual (true)
  })

  it ("returns false on Just", () => {
    expect (Nothing.isJust).toBe (false)
  })
})

describe ("elem", () => {
  it ("returns a Boolean if the values is referencially equal", () => {
    expect (Just ("Just").elem ("Just")).toBe (true)
    expect (Just ("Ju").elem ("Just")).toBe (false)
  })

  it ("returns false on Nothing", () => {
    expect (Nothing.elem ()).toBe (false)
  })
})

describe ("sum", () => {
  it ("returns a numeric Just value", () => {
    expect (Just (5).sum ()).toBe (5)
  })

  it ("returns 0 on Nothing", () => {
    expect (Nothing.sum ()).toBe (0)
  })
})

describe ("product", () => {
  it ("returns a numeric Just value", () => {
    expect (Just (5).product ()).toBe (5)
  })

  it ("returns 1 on Nothing", () => {
    expect (Nothing.product ()).toBe (1)
  })
})

describe ("any", () => {
  const f = (y: string) => y.length > 3

  it ("returns a Boolean if the value matches the predicate", () => {
    expect (Just ("Just").any (f)).toBe (true)
    expect (Just ("Ju").any (f)).toBe (false)
  })

  it ("returns false on Nothing", () => {
    expect (Nothing.any ()).toBe (false)
  })
})

describe ("alt", () => {
  it ("returns itself on a Just", () => {
    const x = Just ("x")
    expect (x.alt ()).toBe (x)
  })

  it ("returns the given parameter on Nothing", () => {
    const x = Just ("x")
    expect (Nothing.alt (x)).toBe (x)
    expect (Nothing.alt (Nothing)).toBe (Nothing)
  })
})

describe ("altLazy", () => {
  it ("returns itself on a Just", () => {
    const x = Just ("x")
    expect (x.altLazy ()).toBe (x)
  })

  it ("excecutes the given function and returns its result on Nothing", () => {
    const x = Just ("x")
    expect (Nothing.altLazy (() => x)).toBe (x)
    expect (Nothing.altLazy (() => Nothing)).toBe (Nothing)
  })
})

describe ("liftM2", () => {
  it ("applies the function to all Just values and returns the value as a Just", () => {
    expect (Just (1).liftM2 (Just (2), (x1, x2) => x1 + x2)).toEqual (Just (3))
  })

  it ("returns Nothing if at least one Maybe is Nothing", () => {
    expect ((Nothing as Maybe<number>).liftM2 (Just (2), (x1, x2) => x1 + x2)).toBe (Nothing)
    expect (Just (1).liftM2 (Nothing as Maybe<number>, (x1, x2) => x1 + x2)).toBe (Nothing)
  })
})

describe ("liftM3", () => {
  it ("applies the function to all Just values and returns the value as a Just", () => {
    expect (Just (1).liftM3 (Just (2), Just (3), (x1, x2, x3) => x1 + x2 + x3)).toEqual (Just (6))
  })

  it ("returns Nothing if at least one Maybe is Nothing", () => {
    expect ((Nothing as Maybe<number>)
      .liftM3 (Just (2), Just (3), (x1, x2, x3) => x1 + x2 + x3)).toBe (Nothing)
    expect (Just (1)
      .liftM3 (Nothing as Maybe<number>, Just (3), (x1, x2, x3) => x1 + x2 + x3)).toBe (Nothing)
    expect (Just (1)
      .liftM3 (Just (2), Nothing as Maybe<number>, (x1, x2, x3) => x1 + x2 + x3)).toBe (Nothing)
  })
})

describe ("liftM4", () => {
  it ("applies the function to all Just values and returns the value as a Just", () => {
    expect (
      Just (1)
        .liftM4 (Just (2), Just (3), Just (4), (x1, x2, x3, x4) => x1 + x2 + x3 + x4)
    )
      .toEqual (Just (10))
  })

  it ("returns Nothing if at least one Maybe is Nothing", () => {
    expect (
      (Nothing as Maybe<number>)
        .liftM4 (Just (2), Just (3), Just (4), (x1, x2, x3, x4) => x1 + x2 + x3 + x4)
    )
      .toBe (Nothing)
    expect (
      Just (1)
        .liftM4 (
          Nothing as Maybe<number>,
          Just (3),
          Just (4),
          (x1, x2, x3, x4) => x1 + x2 + x3 + x4
        )
    )
      .toBe (Nothing)
    expect (
      Just (1)
        .liftM4 (
          Just (2),
          Nothing as Maybe<number>,
          Just (4),
          (x1, x2, x3, x4) => x1 + x2 + x3 + x4
        )
    )
      .toBe (Nothing)
    expect (
      Just (1)
        .liftM4 (
          Just (2),
          Just (3),
          Nothing as Maybe<number>,
          (x1, x2, x3, x4) => x1 + x2 + x3 + x4
        )
    )
      .toBe (Nothing)
  })
})

describe ("liftM5", () => {
  it ("applies the function to all Just values and returns the value as a Just", () => {
    expect (
      Just (1).liftM5 (
        Just (2),
        Just (3),
        Just (4),
        Just (5),
        (x1, x2, x3, x4, x5) => x1 + x2 + x3 + x4 + x5
      )
    ).toEqual (Just (15))
  })

  it ("returns Nothing if at least one Maybe is Nothing", () => {
    expect (
      (Nothing as Maybe<number>).liftM5 (
        Just (2),
        Just (3),
        Just (4),
        Just (5),
        (x1, x2, x3, x4, x5) => x1 + x2 + x3 + x4 + x5
      )
    ).toBe (Nothing)
    expect (
      Just (1).liftM5 (
        Nothing as Maybe<number>,
        Just (3),
        Just (4),
        Just (5),
        (x1, x2, x3, x4, x5) => x1 + x2 + x3 + x4 + x5
      )
    ).toBe (Nothing)
    expect (
      Just (1).liftM5 (
        Just (2),
        Nothing as Maybe<number>,
        Just (4),
        Just (5),
        (x1, x2, x3, x4, x5) => x1 + x2 + x3 + x4 + x5
      )
    ).toBe (Nothing)
    expect (
      Just (1).liftM5 (
        Just (2),
        Just (3),
        Nothing as Maybe<number>,
        Just (5),
        (x1, x2, x3, x4, x5) => x1 + x2 + x3 + x4 + x5
      )
    ).toBe (Nothing)
    expect (
      Just (1).liftM5 (
        Just (2),
        Just (3),
        Just (4),
        Nothing as Maybe<number>,
        (x1, x2, x3, x4, x5) => x1 + x2 + x3 + x4 + x5
      )
    ).toBe (Nothing)
  })
})

describe ("toUndefined", () => {
  it ("returns a Just value", () => {
    expect (Just ("x").toUndefined ()).toBe ("x")
  })

  it ("returns undefined on Nothing", () => {
    expect (Nothing.toUndefined ()).toBe (undefined)
  })
})

describe ("toNullable", () => {
  it ("returns a Just value", () => {
    expect (Just ("x").toNullable ()).toBe ("x")
  })

  it ("returns null on Nothing", () => {
    expect (Nothing.toNullable ()).toBe (null)
  })
})

describe ("ensure", () => {
  const f = (x: number) => x > 0

  it ("returns the passed value in a Just if it matches the predicate", () => {
    expect (ensure (1, f)).toEqual (Just (1))
  })

  it ("returns Nothing if it does not match the predicate", () => {
    expect (ensure (0, f)).toBe (Nothing)
    expect (ensure (-1, f)).toBe (Nothing)
  })
})

describe ("Array Prototype Extensions", () => {
  describe ("mapMaybe", () => {
    it ("maps the function over the values, filtering out Nothings and unwrapping Justs", () => {
      const f = (x: number) => x > 2 ? Just (x * 2) : Nothing
      expect ([ 1, 2, 3, 4 ].mapMaybe (f)).toEqual ([ 6, 8 ])
      expect ([ 4, 5, 6, 7 ].mapMaybe (f)).toEqual ([ 8, 10, 12, 14 ])
    })
  })

  describe ("catMaybes", () => {
    it ("filters out Nothings and unwrapps Justs", () => {
      expect ([ Nothing, Nothing, Just (3), Just (4) ].catMaybes ()).toEqual ([ 3, 4 ])
      expect ([ Just (4), Just (5), Just (6), Just (7) ].catMaybes ()).toEqual ([ 4, 5, 6, 7 ])
    })
  })

  describe ("mapM", () => {
    it ("maps the function over the values and returns a Just of the array if the function returned Justs for all values, otherwise Nothing", () => {
      const f = (x: number) => x > 0 ? Just (x * 2) : Nothing
      expect ([ 1, 2, 3, 4 ].mapM (f)).toEqual (Just ([ 2, 4, 6, 8 ]))
      expect ([ 0, 1, 2, 3 ].mapM (f)).toBe (Nothing)
    })
  })
})
