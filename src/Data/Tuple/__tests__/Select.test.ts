import { Tuple } from "../../Tuple"
import * as Select from "../Select"

describe ("sel1", () => {
  it ("returns the first element", () => {
    expect (Select.sel1 (Tuple (3, 1))) .toEqual (3)
  })

  it ("throws if input Tuple does not contain the required index", () => {
    // @ts-ignore
    expect (() => Select.sel1 (Tuple ())) .toThrow ()
  })
})

describe ("sel2", () => {
  it ("returns the second element", () => {
    expect (Select.sel2 (Tuple (3, "test"))) .toEqual ("test")
  })

  it ("throws if input Tuple does not contain the required index", () => {
    // @ts-ignore
    expect (() => Select.sel2 (Tuple (3))) .toThrow ()
  })
})

describe ("sel3", () => {
  it ("returns the third element", () => {
    expect (Select.sel3 (Tuple (3, "test", [ 1, 2, 3 ]))) .toEqual ([ 1, 2, 3 ])
  })

  it ("throws if input Tuple does not contain the required index", () => {
    // @ts-ignore
    expect (() => Select.sel3 (Tuple (3, "test"))) .toThrow ()
  })
})

describe ("sel4", () => {
  it ("returns the 4th element", () => {
    expect (Select.sel4 (Tuple (3, "test", [ 1, 2, 3 ], true))) .toEqual (true)
  })

  it ("throws if input Tuple does not contain the required index", () => {
    // @ts-ignore
    expect (() => Select.sel4 (Tuple (3, "test", [ 1, 2, 3 ]))) .toThrow ()
  })
})
