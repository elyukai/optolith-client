const { fromUniqueElements } = require('../OrderedSet.new');
const { fromDefault, mergeSafe, makeGetters, makeLenses, makeLenses_, member, notMember, toObject, isRecord } = require('../Record.new');
const { view } = require('../Lens');

// CONSTRUCTOR

test('fromDefault', () => {
  const test = fromDefault ({ x: 0 }) ({ x: 1 })

  expect (test .defaultValues) .toEqual ({ x: 0 })
  expect (test .values) .toEqual ({ x: 1 })
  expect (test .isRecord) .toEqual (true)
  expect (test .keys) .toEqual (fromUniqueElements ('x'))
})

// MERGING RECORDS

test('mergeSafe', () => {
  const testCreator = fromDefault ({ x: 0 })
  const test = testCreator ({ x: 1 })
  const test2 = fromDefault ({ x: 3, y: 3 }) ({ x: 7 })

  expect (mergeSafe (test2) (test)) .toEqual (testCreator ({ x: 7 }))
})

// CUSTOM FUNCTIONS

test('makeGetters', () => {
  const testCreator = fromDefault ({ x: 0 })
  const test = testCreator ({ x: 2 })
  const getters = makeGetters (testCreator)

  expect (getters .x (test)) .toEqual (2)
})

test('makeLenses', () => {
  const testCreator = fromDefault ({ x: 0 })
  const test = testCreator ({ x: 2 })
  const lenses = makeLenses (testCreator)

  expect (view (lenses .x) (test)) .toEqual (2)
})

test('makeLenses_', () => {
  const testCreator = fromDefault ({ x: 0 })
  const test = testCreator ({ x: 2 })
  const getters = makeGetters (testCreator)
  const lenses = makeLenses_ (getters) (testCreator)

  expect (view (lenses .x) (test)) .toEqual (2)
})

test ('member', () => {
  const testCreator = fromDefault ({ x: 0, y: 0 })
  const test = testCreator ({ x: 2 })

  expect (member ('x') (test))
    .toBeTruthy ()
  expect (member ('y') (test))
    .toBeTruthy ()
  expect (member ('z') (test))
    .toBeFalsy ()
})

test ('notMember', () => {
  const testCreator = fromDefault ({ x: 0, y: 0 })
  const test = testCreator ({ x: 2 })

  expect (notMember ('x') (test))
    .toBeFalsy ()
  expect (notMember ('y') (test))
    .toBeFalsy ()
  expect (notMember ('z') (test))
    .toBeTruthy ()
})

test('toObject', () => {
  const testCreator = fromDefault ({ x: 0, y: 0 })
  const test = testCreator ({ x: 2 })

  expect (toObject (test)) .toEqual ({ x: 2, y: 0 })
})

test('isRecord', () => {
  const testCreator = fromDefault ({ x: 0, y: 0 })
  const test = testCreator ({ x: 2 })

  expect (isRecord (test)) .toEqual (true)
  expect (isRecord (3)) .toEqual (false)
})
