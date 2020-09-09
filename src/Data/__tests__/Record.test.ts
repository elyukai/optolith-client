// @ts-check
import { Internals } from "../Internals"
import { view } from "../Lens"
import { fromUniqueElements } from "../OrderedSet"
import { fromDefault, isRecord, makeLenses, member, notMember, toObject } from "../Record"

const { Nothing } = Internals

// CONSTRUCTOR

test ("fromDefault", () => {
  const test = fromDefault ("Test") ({ x: 0 }) ({ x: 1 })

  expect (test .defaultValues) .toEqual ({ x: 0 })
  expect (test .values) .toEqual ({ x: 1 })
  expect (test .isRecord) .toEqual (true)
  expect (test .keys) .toEqual (fromUniqueElements ("x"))
})

// CUSTOM FUNCTIONS

test ("makeLenses", () => {
  const testCreator = fromDefault ("TestCreator") ({ x: 0 })
  const test = testCreator ({ x: 2 })
  const lenses = makeLenses (testCreator)

  expect (view (lenses .x) (test)) .toEqual (2)
})

test ("member", () => {
  const testCreator = fromDefault ("TestCreator") ({ x: 0, y: 0 })
  const test = testCreator ({ x: 2, y: Nothing })

  expect (member ("x") (test))
    .toBeTruthy ()
  expect (member ("y") (test))
    .toBeTruthy ()
  expect (member ("z") (test))
    .toBeFalsy ()
})

test ("notMember", () => {
  const testCreator = fromDefault ("TestCreator") ({ x: 0, y: 0 })
  const test = testCreator ({ x: 2, y: Nothing })

  expect (notMember ("x") (test))
    .toBeFalsy ()
  expect (notMember ("y") (test))
    .toBeFalsy ()
  expect (notMember ("z") (test))
    .toBeTruthy ()
})

test ("toObject", () => {
  const testCreator = fromDefault ("TestCreator") ({ x: 0, y: 0 })
  const test = testCreator ({ x: 2, y: Nothing })

  expect (toObject (test)) .toEqual ({ x: 2, y: 0 })
})

test ("isRecord", () => {
  const testCreator = fromDefault ("TestCreator") ({ x: 0, y: 0 })
  const test = testCreator ({ x: 2, y: Nothing })

  expect (isRecord (test)) .toEqual (true)
  expect (isRecord (3)) .toEqual (false)
})
