// @ts-check
const SourceUtils = require ("../SourceUtils")
const { List } = require ("../../../Data/List")
const { Pair } = require ("../../../Data/Tuple")

describe ("groupSortInt", () => {
  it ("should return the same list if there are no ints to group", () => {
    expect (SourceUtils.groupSortInt (List (1, 3, 5, 7, 9)))
      .toEqual (List (1, 3, 5, 7, 9))
  })

  it ("should return a grouped and sorted list if there are ints to group", () => {
    expect (SourceUtils.groupSortInt (List (1, 3, 12, 4, 7, 5, 9, 10)))
      // @ts-ignore
      .toEqual (List (1, Pair (3, 5), 7, Pair (9, 10), 12))
  })
})
