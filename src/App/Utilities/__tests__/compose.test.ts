import { view } from "../../../Data/Lens"
import { fromDefault, makeLenses } from "../../../Data/Record"
import { composeL } from "../compose"

test ("composeL", () => {
  const b = fromDefault ("A") ({ x: 1, y: "test" })
  const a = fromDefault ("B") ({ z: 1, q: b .default })

  const bL = makeLenses (b)
  const aL = makeLenses (a)

  expect (view (composeL (aL.q, bL.y)) (a .default)) .toEqual ("test")
})
