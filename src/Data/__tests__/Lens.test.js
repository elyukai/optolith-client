const Lens = require ('../Lens')
const { add } = require ('../../App/Utils/mathUtils')

test ('view', () => {
  const customLens = Lens.lens (e => e.value)
                               (e => value => ({ ...e, value }))

  const obj = { value: 5 }

  expect (Lens.view (customLens) (obj)) .toEqual (5)
})

test ('over', () => {
  const customLens = Lens.lens (e => e.value)
                               (e => value => ({ ...e, value }))

  const obj = { value: 5 }

  expect (Lens.over (customLens) (add (3)) (obj)) .toEqual ({ value: 8 })
})

test ('set', () => {
  const customLens = Lens.lens (e => e.value)
                               (e => value => ({ ...e, value }))

  const obj = { value: 5 }

  expect (Lens.set (customLens) (3) (obj)) .toEqual ({ value: 3 })
})
