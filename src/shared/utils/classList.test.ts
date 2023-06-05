import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { classList } from "./classList.ts"

describe("classList", () => {
  it("returns a string of class names from the given arguments", () => {
    assert.equal(
      classList(
        "foo",
        "bar",
        undefined,
        null,
        { baz: true, no: false, alsoNo: undefined },
      ),
      "foo bar baz"
    )
  })
})
