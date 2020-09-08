// @ts-check
import * as Lens from "../Lens"
import { add } from "../Num"

test ("view", () => {
  const obj = { value: 5 }

  const customLens = Lens.lens ((e: typeof obj) => e.value)
                               ((e: typeof obj) => value => ({ ...e, value }))

  expect (Lens.view (customLens) (obj)) .toEqual (5)
})

test ("over", () => {
  const obj = { value: 5 }

  const customLens = Lens.lens ((e: typeof obj) => e.value)
                               ((e: typeof obj) => value => ({ ...e, value }))

  expect (Lens.over (customLens) (add (3)) (obj)) .toEqual ({ value: 8 })
})

test ("set", () => {
  const obj = { value: 5 }

  const customLens = Lens.lens ((e: typeof obj) => e.value)
                               ((e: typeof obj) => value => ({ ...e, value }))

  expect (Lens.set (customLens) (3) (obj)) .toEqual ({ value: 3 })
})
