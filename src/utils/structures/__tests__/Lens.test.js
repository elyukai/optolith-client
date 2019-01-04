const Lens = require ('../Lens')
const { add } = require ('../../mathUtils')

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

test ('pipeL', () => {
  const customLens = Lens.lens (e => e.value)
                               (e => value => ({ ...e, value }))

  const xLens = Lens.lens (e => e.x)
                          (e => x => ({ ...e, x }))

  const obj = { value: { x: 5 } }

  const pipedLenses = Lens.pipeL (customLens, xLens)

  expect (Lens.view (pipedLenses) (obj)) .toEqual (5)
  expect (Lens.over (pipedLenses) (add (3)) (obj))
    .toEqual ({ value: { x: 8 } })
  expect (Lens.set (pipedLenses) (3) (obj))
    .toEqual ({ value: { x: 3 } })
})
