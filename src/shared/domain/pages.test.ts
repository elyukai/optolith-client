import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { comparePage } from "./pages.ts"

describe("comparePage", () => {
  it("returns 0 if the pages are equal", () => {
    assert.equal(
      comparePage(
        { tag: "InsideCoverBack", inside_cover_back: {} },
        { tag: "InsideCoverBack", inside_cover_back: {} },
      ),
      0
    )
    assert.equal(
      comparePage(
        { tag: "InsideCoverFront", inside_cover_front: {} },
        { tag: "InsideCoverFront", inside_cover_front: {} },
      ),
      0
    )
    assert.equal(
      comparePage(
        { tag: "Numbered", numbered: 42 },
        { tag: "Numbered", numbered: 42 },
      ),
      0,
    )
  })

  it("returns a negative number if first should be sorted before the second", () => {
    assert.equal(
      comparePage(
        { tag: "InsideCoverFront", inside_cover_front: {} },
        { tag: "InsideCoverBack", inside_cover_back: {} },
      ),
      -1
    )
    assert.equal(
      comparePage(
        { tag: "InsideCoverFront", inside_cover_front: {} },
        { tag: "Numbered", numbered: 42 },
      ),
      -1
    )
    assert.equal(
      comparePage(
        { tag: "Numbered", numbered: 42 },
        { tag: "InsideCoverBack", inside_cover_back: {} },
      ),
      -1
    )
    assert.equal(
      comparePage(
        { tag: "Numbered", numbered: 24 },
        { tag: "Numbered", numbered: 42 },
      ),
      -18,
    )
  })

  it("returns a positive number if first should be sorted after the second", () => {
    assert.equal(
      comparePage(
        { tag: "InsideCoverBack", inside_cover_back: {} },
        { tag: "InsideCoverFront", inside_cover_front: {} },
      ),
      1
    )
    assert.equal(
      comparePage(
        { tag: "Numbered", numbered: 42 },
        { tag: "InsideCoverFront", inside_cover_front: {} },
      ),
      1
    )
    assert.equal(
      comparePage(
        { tag: "InsideCoverBack", inside_cover_back: {} },
        { tag: "Numbered", numbered: 42 },
      ),
      1
    )
    assert.equal(
      comparePage(
        { tag: "Numbered", numbered: 42 },
        { tag: "Numbered", numbered: 24 },
      ),
      18,
    )
  })
})
