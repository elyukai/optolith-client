// @ts-check
const { composeL } = require ('../compose')
const { view } = require ('../../../Data/Lens')
const { fromDefault, makeLenses } = require ('../../../Data/Record')

test ('composeL', () => {
  const b = fromDefault ("A") ({ x: 1, y: "test" })
  const a = fromDefault ("B") ({ z: 1, q: b .default })

  const bL = makeLenses (b)
  const aL = makeLenses (a)

  expect (view (composeL (aL.q, bL.y)) (a .default)) .toEqual ("test")
})
