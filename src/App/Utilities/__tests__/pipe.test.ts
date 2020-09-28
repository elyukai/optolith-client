import { pipe, pipe_ } from "../pipe"

test ("pipe", () => {
  expect (pipe ((x: number) => x + 2, x => x * 3) (3)) .toEqual (15)
})

test ("pipe_", () => {
  expect (pipe_ (3, x => x + 2, x => x * 3)) .toEqual (15)
})
