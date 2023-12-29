import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { getSkillValue } from "./skill.ts"

describe(getSkillValue.name, () => {
  it("returns 8 if a dynamic entry is not present", () => {
    assert.equal(getSkillValue(undefined), 0)
  })

  it("returns the value from a present dynamic entry", () => {
    assert.equal(
      getSkillValue({
        id: 1,
        value: 8,
        cachedAdventurePoints: { general: 0, bound: 0 },
        dependencies: [],
        boundAdventurePoints: [],
      }),
      8,
    )
    assert.equal(
      getSkillValue({
        id: 1,
        value: 10,
        cachedAdventurePoints: { general: 0, bound: 0 },
        dependencies: [],
        boundAdventurePoints: [],
      }),
      10,
    )
  })
})
