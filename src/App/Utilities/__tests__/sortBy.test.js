// @ts-check
const { sortRecordsBy, comparingR, sortRecordsByName, sortStrings } = require ("../sortBy")
const { compare } = require ("../../../Data/Num")
const { List } = require ("../../../Data/List")
const { fromDefault } = require ("../../../Data/Record")

describe ("sortRecordsBy", () => {
  it ("sorts a list of record by one comparing factor", () => {
    const X = fromDefault ("X") ({ x: 0 })

    const xs =
      List (
        X ({ x: 2 }),
        X ({ x: 3 }),
        X ({ x: 1 }),
        X ({ x: -1 }),
        X ({ x: 4 }),
        X ({ x: 6 }),
        X ({ x: 5 }),
        X ({ x: 0 }),
      )

    const exs =
      List (
        X ({ x: -1 }),
        X ({ x: 0 }),
        X ({ x: 1 }),
        X ({ x: 2 }),
        X ({ x: 3 }),
        X ({ x: 4 }),
        X ({ x: 5 }),
        X ({ x: 6 }),
      )

    expect (sortRecordsBy ([ comparingR (X.A.x) (compare) ]) (xs))
      .toEqual (exs)
  })

  it ("sorts a list of record by two comparing factors", () => {
    const X = fromDefault ("X") ({ x: 0, y: 0 })

    const xs =
      List (
        X ({ x: 3, y: 2 }),
        X ({ x: 3, y: 1 }),
        X ({ x: 1, y: 0 }),
        X ({ x: -1, y: 0 }),
        X ({ x: 5, y: 0 }),
        X ({ x: 3, y: 0 }),
        X ({ x: 3, y: 3 }),
        X ({ x: 0, y: 0 }),
      )

    const exs =
      List (
        X ({ x: -1, y: 0 }),
        X ({ x: 0, y: 0 }),
        X ({ x: 1, y: 0 }),
        X ({ x: 3, y: 0 }),
        X ({ x: 3, y: 1 }),
        X ({ x: 3, y: 2 }),
        X ({ x: 3, y: 3 }),
        X ({ x: 5, y: 0 }),
      )

    expect (sortRecordsBy ([ comparingR (X.A.x) (compare), comparingR (X.A.y) (compare) ]) (xs))
      .toEqual (exs)
  })
  it ("sorts a list of record by two comparing factors reversed", () => {
    const X = fromDefault ("X") ({ x: 0, y: 0 })

    const xs =
      List (
        X ({ x: 3, y: 2 }),
        X ({ x: 3, y: 1 }),
        X ({ x: 1, y: 0 }),
        X ({ x: -1, y: 0 }),
        X ({ x: 5, y: 0 }),
        X ({ x: 3, y: 0 }),
        X ({ x: 3, y: 3 }),
        X ({ x: 0, y: 0 }),
      )

    const exs =
      List (
        X ({ x: -1, y: 0 }),
        X ({ x: 0, y: 0 }),
        X ({ x: 1, y: 0 }),
        X ({ x: 3, y: 0 }),
        X ({ x: 5, y: 0 }),
        X ({ x: 3, y: 1 }),
        X ({ x: 3, y: 2 }),
        X ({ x: 3, y: 3 }),
      )

    expect (sortRecordsBy ([ comparingR (X.A.y) (compare), comparingR (X.A.x) (compare) ]) (xs))
      .toEqual (exs)
  })
})

// test .todo ("sortRecordsByName")

// test .todo ("sortStrings")
