import { Tuple } from "../../Tuple"
import * as Update from "../Update"

describe ("upd1", () => {
  it ("sets the first element", () => {
    expect (Update.upd1 ("abc") (Tuple (3, 1)))
      .toEqual (Tuple ("abc", 1))
  })

  it ("throws if input Tuple does not contain the required index", () => {
    // @ts-ignore
    expect (() => Update.upd1 ("abc") (Tuple ())) .toThrow ()
  })
})

describe ("upd2", () => {
  it ("sets the second element", () => {
    expect (Update.upd2 ("abc") (Tuple (3, "test")))
      .toEqual (Tuple (3, "abc"))
  })

  it ("throws if input Tuple does not contain the required index", () => {
    // @ts-ignore
    expect (() => Update.upd2 ("abc") (Tuple (3))) .toThrow ()
  })
})

describe ("upd3", () => {
  it ("sets the third element", () => {
    expect (Update.upd3 ("abc") (Tuple (3, "test", [ 1, 2, 3 ])))
      .toEqual (Tuple (3, "test", "abc"))
  })

  it ("throws if input Tuple does not contain the required index", () => {
    // @ts-ignore
    expect (() => Update.upd3 ("abc") (Tuple (3, "test"))) .toThrow ()
  })
})

describe ("upd4", () => {
  it ("sets the 4th element", () => {
    expect (Update.upd4 ("abc") (Tuple (3, "test", [ 1, 2, 3 ], true)))
      .toEqual (Tuple (3, "test", [ 1, 2, 3 ], "abc"))
  })

  it ("throws if input Tuple does not contain the required index", () => {
    // @ts-ignore
    expect (() => Update.upd4 ("abc") (Tuple (3, "test", [ 1, 2, 3 ]))) .toThrow ()
  })
})
