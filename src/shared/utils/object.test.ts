import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { mapObject } from "./object.js"

describe("mapObject", () => {
  it("maps all own properties of an object to a new object", () => {
    const object = { a: 1, b: 2, c: 3 }
    const result = mapObject(object, (value, key) => value + key)
    assert.deepEqual(result, { a: "1a", b: "2b", c: "3c" })
  })

  it("omits properties for which the mapping function returns undefined", () => {
    const object = { a: 1, b: 2, c: 3 }
    const result = mapObject(object, (value, key) => (key === "b" ? undefined : value + key))
    assert.deepEqual(result, { a: "1a", c: "3c" })
  })
})
