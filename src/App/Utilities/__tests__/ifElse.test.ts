import { ifElse } from "../ifElse"

describe ("ifElse", () => {
  it ("uses the second function if the predicate returns true", () => {
    expect (ifElse ((x: number) => x > 3)
                   (x => x * 3)
                   (x => -x)
                   (4))
      .toBe (12)
  })

  it ("uses the third function if the predicate returns false", () => {
    expect (ifElse ((x: number) => x > 3)
                   (x => x * 3)
                   (x => -x)
                   (3))
      .toBe (-3)
  })
})
