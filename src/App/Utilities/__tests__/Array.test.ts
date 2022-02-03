import "../Array"
import { Just, Nothing } from "../Maybe"

describe ("Array Prototype Extensions", () => {
  describe ("drop", () => {
    const xs = [ 1, 2, 3, 4, 5, 6 ]

    it ("returns the original array if the number is zero or negative", () => {
      expect (xs.drop (-1)).toBe (xs)
      expect (xs.drop (0)).toBe (xs)
    })

    it ("removes the given amount of items from the start of the array", () => {
      expect (xs.drop (1)).toEqual ([ 2, 3, 4, 5, 6 ])
      expect (xs.drop (2)).toEqual ([ 3, 4, 5, 6 ])
    })

    it ("returns an empty array if the number is larger than the size of the array", () => {
      expect (xs.drop (6)).toEqual ([])
      expect (xs.drop (7)).toEqual ([])
    })
  })

  describe ("take", () => {
    const xs = [ 1, 2, 3, 4, 5, 6 ]

    it ("returns an empty array if the number is zero or negative", () => {
      expect (xs.take (-1)).toEqual ([])
      expect (xs.take (0)).toEqual ([])
    })

    it ("returns the given amount of items from the start of the array", () => {
      expect (xs.take (1)).toEqual ([ 1 ])
      expect (xs.take (2)).toEqual ([ 1, 2 ])
    })

    it ("returns the original array if the number is larger than the size of the array", () => {
      expect (xs.take (6)).toBe (xs)
      expect (xs.take (7)).toBe (xs)
    })
  })

  describe ("deleteAt", () => {
    const xs = [ 1, 2, 3, 4, 5, 6 ]

    it ("returns the original array if the index is negative", () => {
      expect (xs.deleteAt (-1)).toBe (xs)
    })

    it ("returns the original array if the index exceeds the array size", () => {
      expect (xs.deleteAt (6)).toBe (xs)
      expect (xs.deleteAt (7)).toBe (xs)
    })

    it ("returns a new array with the element at the respective index removed", () => {
      expect (xs.deleteAt (0)).toEqual ([ 2, 3, 4, 5, 6 ])
      expect (xs.deleteAt (1)).toEqual ([ 1, 3, 4, 5, 6 ])
      expect (xs.deleteAt (2)).toEqual ([ 1, 2, 4, 5, 6 ])
    })
  })

  describe ("maximum", () => {
    it ("returns negative infinity if the array is empty", () => {
      expect ([].maximum ()).toBe (-Infinity)
    })

    it ("returns the largest value in the array", () => {
      expect ([ 1, 2, 3, 4, 5, 6 ].maximum ()).toBe (6)
      expect ([ 3, 2, 1 ].maximum ()).toBe (3)
      expect ([ 3, 4, 1 ].maximum ()).toBe (4)
    })
  })

  describe ("minimum", () => {
    it ("returns infinity if the array is empty", () => {
      expect ([].minimum ()).toBe (Infinity)
    })

    it ("returns the smallest value in the array", () => {
      expect ([ 1, 2, 3, 4, 5, 6 ].minimum ()).toBe (1)
      expect ([ 3, 2, 1 ].minimum ()).toBe (1)
      expect ([ 3, 0, 1 ].minimum ()).toBe (0)
    })
  })

  describe ("append", () => {
    it ("appends an element to the array and returns a new array", () => {
      const xs1 = ([] as number[])
      expect (xs1.append (1)).toEqual ([ 1 ])
      expect (xs1.append (1)).not.toBe (xs1)

      const xs2 = [ 1 ]
      expect (xs2.append (2)).toEqual ([ 1, 2 ])
      expect (xs2.append (2)).not.toBe (xs2)
    })
  })

  describe ("nub", () => {
    it ("removes any duplicate elements based on reference equality", () => {
      expect ([ 2, 3, 2, 4, 1, 1, 2, 5, 6 ].nub ()).toEqual ([ 2, 3, 4, 1, 5, 6 ])
    })
  })

  describe ("findM", () => {
    it ("returns the first value where the predicate returns true as a Just", () => {
      expect ([ 2, 3, 2, 4, 1, 1, 2, 5, 6 ].findM (x => x > 3)).toEqual (Just (4))
    })

    it ("returns Nothing if the predicate returns true for no element", () => {
      expect ([ 2, 3, 2, 3, 1, 1, 2, 2, 1 ].findM (x => x > 3)).toEqual (Nothing)
    })
  })

  describe ("bind", () => {
    it ("maps over the array and flattens the results into a single array", () => {
      expect ([ 1, 2, 3 ].bind (x => Array.from ({ length: x }).fill (x)))
        .toEqual ([ 1, 2, 2, 3, 3, 3 ])
    })
  })
})
