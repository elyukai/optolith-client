const { pipe } = require ('../pipe')
const { view } = require ('../../../Data/Lens')
const { fromDefault, makeLenses } = require ('../../../Data/Record')

test ('pipe', () => {
  expect (pipe (x => x + 2, x => x * 3) (3)) .toEqual (15)
})

test ('pipe_', () => {
  expect (pipe_ (3, x => x + 2, x => x * 3)) .toEqual (15)
})
