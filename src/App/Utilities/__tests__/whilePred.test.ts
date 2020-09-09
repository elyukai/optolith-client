import { whilePred } from "../whilePred"

test ("whilePred", () => {
  expect (whilePred ((x: number) => x < 1000) (x => x * 2) (1)) .toEqual (1024)
})
