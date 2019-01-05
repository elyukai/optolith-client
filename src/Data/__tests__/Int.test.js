const Int = require ('../Int')
const { EQ, LT, GT } = require ('../Ord')

test ('compare', () => {
  expect (Int.compare (1) (2)) .toEqual (LT)
  expect (Int.compare (3) (2)) .toEqual (GT)
  expect (Int.compare (2) (2)) .toEqual (EQ)
})
