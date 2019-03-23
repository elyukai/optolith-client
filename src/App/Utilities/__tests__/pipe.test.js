// @ts-check
const { pipe, pipe_ } = require ('../pipe')

test ('pipe', () => {
  expect (pipe (x => x + 2, x => x * 3) (3)) .toEqual (15)
})

test ('pipe_', () => {
  expect (pipe_ (3, x => x + 2, x => x * 3)) .toEqual (15)
})
