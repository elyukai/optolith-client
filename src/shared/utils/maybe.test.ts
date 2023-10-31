import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { Just, Nothing, combine, fromNullable, isJust, isNothing, map, reduce } from "./maybe.ts"

describe(Just.name, () => {
  it("creates a maybe that contains a value", () => {
    const maybe = Just("hello")
    assert.deepEqual(maybe, { tag: "Just", value: "hello" })
  })
})

describe("Nothing", () => {
  it("creates a maybe that contains nothing", () => {
    const maybe = Nothing
    assert.deepEqual(maybe, { tag: "Nothing" })
  })
})

describe(isJust.name, () => {
  it("returns true if the maybe contains a value", () => {
    const maybe = Just("hello")
    assert.equal(isJust(maybe), true)
  })

  it("returns false if the maybe contains nothing", () => {
    const maybe = Nothing
    assert.equal(isJust(maybe), false)
  })
})

describe(isNothing.name, () => {
  it("returns true if the maybe contains nothing", () => {
    const maybe = Nothing
    assert.equal(isNothing(maybe), true)
  })

  it("returns false if the maybe contains a value", () => {
    const maybe = Just("hello")
    assert.equal(isNothing(maybe), false)
  })
})

describe(fromNullable.name, () => {
  it("creates a maybe that contains a value if the input is not null or undefined", () => {
    const maybe = fromNullable("hello")
    assert.deepEqual(maybe, { tag: "Just", value: "hello" })
  })

  it("creates a maybe that contains nothing if the input is null", () => {
    const maybe = fromNullable(null)
    assert.deepEqual(maybe, { tag: "Nothing" })
  })

  it("creates a maybe that contains nothing if the input is undefined", () => {
    const maybe = fromNullable(undefined)
    assert.deepEqual(maybe, { tag: "Nothing" })
  })
})

describe(reduce.name, () => {
  it("returns the default value if the maybe contains nothing", () => {
    const maybe = Nothing
    const result = reduce<string, string>(maybe, "default", value => value.toUpperCase())
    assert.equal(result, "default")
  })

  it("applies the function to the value if the maybe contains a value", () => {
    const maybe = Just("hello")
    const result = reduce(maybe, "default", value => value.toUpperCase())
    assert.equal(result, "HELLO")
  })
})

describe(map.name, () => {
  it("returns a maybe that contains nothing if the input maybe contains nothing", () => {
    const maybe = Nothing
    const result = map<string, string>(maybe, value => value.toUpperCase())
    assert.deepEqual(result, { tag: "Nothing" })
  })

  it("applies the function to the value if the input maybe contains a value", () => {
    const maybe = Just("hello")
    const result = map(maybe, value => value.toUpperCase())
    assert.deepEqual(result, { tag: "Just", value: "HELLO" })
  })
})

describe(combine.name, () => {
  it("returns a maybe that contains nothing if either input maybe contains nothing", () => {
    const maybe1 = Just("hello")
    const maybe2 = Nothing
    const result = combine(maybe1, maybe2, (value1, value2) => value1 + value2)
    assert.deepEqual(result, { tag: "Nothing" })
  })

  it("applies the function to the values if both input maybes contain a value", () => {
    const maybe1 = Just("hello")
    const maybe2 = Just("world")
    const result = combine(maybe1, maybe2, (value1, value2) => `${value1} ${value2}`)
    assert.deepEqual(result, { tag: "Just", value: "hello world" })
  })
})
