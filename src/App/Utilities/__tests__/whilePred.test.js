// @ts-check
const { whilePred } = require ('../whilePred')

test ('whilePred', () => {
  expect (whilePred (x => x > 1000) (x => x * 2) (1)) .toEqual (1024)
})
