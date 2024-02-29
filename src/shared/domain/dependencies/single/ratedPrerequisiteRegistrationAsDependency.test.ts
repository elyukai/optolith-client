import { produce } from "immer"
import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { baseCharacter } from "../../character.test.ts"
import { RegistrationMethod } from "../registrationHelpers.ts"
import { registerOrUnregisterRatedPrerequisiteAsDependency } from "./ratedPrerequisiteRegistrationAsDependency.ts"

describe(registerOrUnregisterRatedPrerequisiteAsDependency.name, () => {
  it("adds a dependency to an attribute that does not have a dynamic entry yet", () => {
    const initialCharacter = baseCharacter

    const expectedCharacter = produce(baseCharacter, draft => {
      draft.attributes[1] = {
        id: 1,
        value: 8,
        cachedAdventurePoints: { general: 0, bound: 0 },
        dependencies: [
          {
            source: { tag: "Spell", spell: 1 },
            value: { tag: "Fixed", value: { tag: "Minimum", minimum: 10 } },
            index: 0,
            isPartOfDisjunction: false,
          },
        ],
        boundAdventurePoints: [],
      }
    })

    assert.deepEqual(
      produce(initialCharacter, draft =>
        registerOrUnregisterRatedPrerequisiteAsDependency(
          RegistrationMethod.Add,
          draft,
          { id: { tag: "Attribute", attribute: 1 }, value: 10 },
          { tag: "Spell", spell: 1 },
          0,
          false,
        ),
      ),
      expectedCharacter,
    )
  })

  it("adds a dependency to an attribute that has a dynamic entry", () => {
    const initialCharacter = produce(baseCharacter, draft => {
      draft.attributes[1] = {
        id: 1,
        value: 10,
        cachedAdventurePoints: { general: 30, bound: 0 },
        dependencies: [],
        boundAdventurePoints: [],
      }
    })

    const expectedCharacter = produce(baseCharacter, draft => {
      draft.attributes[1] = {
        id: 1,
        value: 10,
        cachedAdventurePoints: { general: 30, bound: 0 },
        dependencies: [
          {
            source: { tag: "Spell", spell: 1 },
            value: { tag: "Fixed", value: { tag: "Minimum", minimum: 10 } },
            index: 0,
            isPartOfDisjunction: false,
          },
        ],
        boundAdventurePoints: [],
      }
    })

    assert.deepEqual(
      produce(initialCharacter, draft =>
        registerOrUnregisterRatedPrerequisiteAsDependency(
          RegistrationMethod.Add,
          draft,
          { id: { tag: "Attribute", attribute: 1 }, value: 10 },
          { tag: "Spell", spell: 1 },
          0,
          false,
        ),
      ),
      expectedCharacter,
    )
  })

  it("removes a dependency from an attribute", () => {
    const initialCharacter = produce(baseCharacter, draft => {
      draft.attributes[1] = {
        id: 1,
        value: 10,
        cachedAdventurePoints: { general: 30, bound: 0 },
        dependencies: [
          {
            source: { tag: "Spell", spell: 1 },
            value: { tag: "Fixed", value: { tag: "Minimum", minimum: 10 } },
            index: 0,
            isPartOfDisjunction: false,
          },
          {
            source: { tag: "Ritual", ritual: 1 },
            value: { tag: "Fixed", value: { tag: "Minimum", minimum: 11 } },
            index: 0,
            isPartOfDisjunction: false,
          },
        ],
        boundAdventurePoints: [],
      }
    })

    const expectedCharacter = produce(baseCharacter, draft => {
      draft.attributes[1] = {
        id: 1,
        value: 10,
        cachedAdventurePoints: { general: 30, bound: 0 },
        dependencies: [
          {
            source: { tag: "Ritual", ritual: 1 },
            value: { tag: "Fixed", value: { tag: "Minimum", minimum: 11 } },
            index: 0,
            isPartOfDisjunction: false,
          },
        ],
        boundAdventurePoints: [],
      }
    })

    assert.deepEqual(
      produce(initialCharacter, draft =>
        registerOrUnregisterRatedPrerequisiteAsDependency(
          RegistrationMethod.Remove,
          draft,
          { id: { tag: "Attribute", attribute: 1 }, value: 10 },
          { tag: "Spell", spell: 1 },
          0,
          false,
        ),
      ),
      expectedCharacter,
    )
  })
})
