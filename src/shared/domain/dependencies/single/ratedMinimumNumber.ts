import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type {
  ActivatableIdentifier,
  RatedMinimumNumberPrerequisite,
} from "@optolith/database-schema/gen"
import { flattenAspects } from "../../rated/liturgicalChant.ts"
import type { RatedDependency } from "../../rated/ratedDependency.ts"
import type { RegistrationFunction } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link RatedMinimumNumberPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterRatedMinimumNumberPrerequisiteAsDependency: RegistrationFunction<
  RatedMinimumNumberPrerequisite,
  ActivatableIdentifier
> = (p, method, character, sourceId, index, isPartOfDisjunction): void => {
  const dependency: RatedDependency = {
    source: sourceId,
    index,
    isPartOfDisjunction,
    value: {
      tag: "MinimumNumberAtMinimumValue",
      minimumCount: p.number,
      minimumValue: p.value,
      target: p.targets,
    },
  }

  switch (p.targets.kind) {
    case "Skills":
      return p.targets.Skills.targets.forEach(ref =>
        character.skills.addOrRemoveDependency(ref, method, dependency),
      )
    case "CombatTechniques": {
      const modifyForEntity = (entity: "CloseCombatTechnique" | "RangedCombatTechnique"): void =>
        character.global.db
          .getAllInstanceContainersOfEntity(entity)
          .forEach(({ id }) =>
            character.getRatedCollection(entity).addOrRemoveDependency(id, method, dependency),
          )

      switch (p.targets.CombatTechniques.group.kind) {
        case "All":
          modifyForEntity("CloseCombatTechnique")
          modifyForEntity("RangedCombatTechnique")
          return
        case "Close":
          modifyForEntity("CloseCombatTechnique")
          return
        case "Ranged":
          modifyForEntity("RangedCombatTechnique")
          return
        default:
          return assertExhaustive(p.targets.CombatTechniques.group)
      }
    }
    case "Spellworks": {
      const propertyId = p.targets.Spellworks.property
      const modifyForEntity = (entity: "Spell" | "Ritual"): void =>
        character.global.db.getAllInstanceContainersOfEntity(entity).forEach(({ id, content }) => {
          if (content.property === propertyId) {
            character.getRatedCollection(entity).addOrRemoveDependency(id, method, dependency)
          }
        })

      modifyForEntity("Spell")
      modifyForEntity("Ritual")
      return
    }
    case "Liturgies": {
      const aspectId = p.targets.Liturgies.aspect
      const modifyForEntity = (entity: "LiturgicalChant" | "Ceremony"): void =>
        character.global.db.getAllInstanceContainersOfEntity(entity).forEach(({ id, content }) => {
          if (flattenAspects(content.traditions).includes(aspectId)) {
            character.getRatedCollection(entity).addOrRemoveDependency(id, method, dependency)
          }
        })

      modifyForEntity("LiturgicalChant")
      modifyForEntity("Ceremony")
      return
    }
    default:
      return assertExhaustive(p.targets)
  }
}
