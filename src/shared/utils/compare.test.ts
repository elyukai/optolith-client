import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { compareAt, deepEqual, numAsc, reduceCompare } from "./compare.ts"

describe("compareAt", () => {
  it("builds a compare function for a nested value", () => {
    const compare1 = compareAt((x: { first: number; second: number }) => x.first, numAsc)
    assert.equal(compare1({ first: 3, second: 6 }, { first: 2, second: 2 }), 1)

    const compare2 = compareAt((x: { first: number; second: number }) => x.second, numAsc, true)
    assert.equal(compare2({ first: 3, second: 6 }, { first: 2, second: 2 }), -4)
  })
})

describe("reduceCompare", () => {
  it("chains multiple comparison functions", () => {
    assert.deepEqual(
      [
        { first: 2, second: 6 },
        { first: 2, second: 2 },
        { first: 1, second: 2 },
        { first: 3, second: 1 },
        { first: 1, second: 6 },
        { first: 2, second: 3 },
      ].sort(
        reduceCompare(
          compareAt(x => x.first, numAsc),
          compareAt(x => x.second, numAsc, true),
        ),
      ),
      [
        { first: 1, second: 6 },
        { first: 1, second: 2 },
        { first: 2, second: 6 },
        { first: 2, second: 3 },
        { first: 2, second: 2 },
        { first: 3, second: 1 },
      ],
    )
  })
})

describe(deepEqual.name, () => {
  it("returns true if two objects are equal", () => {
    const object1 = { a: 1, b: { c: 2, d: [3, 4] } }
    const object2 = { a: 1, b: { c: 2, d: [3, 4] } }
    const object3 = { a: 1, b: { c: 2, d: [3, 4, 5] } }
    const object4 = { a: 1, b: { c: 2 } }
    const object5 = { a: 1, b: { c: 3 } }
    const object6 = { a: 1, b: { c: 2, d: 4 } }

    assert.equal(deepEqual(object1, object2), true)
    assert.equal(deepEqual(object1, object3), false)
    assert.equal(deepEqual(object4, object5), false)
    assert.equal(deepEqual(object4, object6), false)
  })

  it("returns true if two objects are equal", () => {
    const array1 = [1, 2, [3, 4, [5, 6]]]
    const array2 = [1, 2, [3, 4, [5, 6]]]
    const array3 = [1, 2, [3, 4, [5, 7]]]

    assert.equal(deepEqual(array1, array2), true)
    assert.equal(deepEqual(array1, array3), false)
  })

  it("returns true if two mixed objects and arrays are equal", () => {
    const mixed1 = { a: 1, b: [2, 3, { c: 4, d: [5, 6] }] }
    const mixed2 = { a: 1, b: [2, 3, { c: 4, d: [5, 6] }] }
    const mixed3 = { a: 1, b: [2, 3, { c: 4, d: [5, 7] }] }

    assert.equal(deepEqual(mixed1, mixed2), true)
    assert.equal(deepEqual(mixed1, mixed3), false)
  })
})
