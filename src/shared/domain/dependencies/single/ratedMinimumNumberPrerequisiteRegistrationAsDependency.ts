import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { RatedMinimumNumberPrerequisite } from "optolith-database-schema/types/prerequisites/single/RatedMinimumNumberPrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { createEmptyDynamicCombatTechnique } from "../../rated/combatTechnique.ts"
import { createEmptyDynamicLiturgicalChant } from "../../rated/liturgicalChant.ts"
import { RatedDependency } from "../../rated/ratedDependency.ts"
import { createEmptyDynamicSkill } from "../../rated/skill.ts"
import { createEmptyDynamicSpell } from "../../rated/spell.ts"
import { RegistrationFunction, addOrRemoveDependencyInSlice } from "../registrationHelpers.ts"

/**
 * Registers or unregisters a {@link RatedMinimumNumberPrerequisite} as a dependency on the
 * character's draft.
 */
export const registerOrUnregisterRatedMinimumNumberPrerequisiteAsDependency: RegistrationFunction<
  RatedMinimumNumberPrerequisite,
  ActivatableIdentifier,
  {
    closeCombatTechniqueIds: number[]
    rangedCombatTechniqueIds: number[]
    getSpellIdsByPropertyId: (id: number) => number[]
    getRitualIdsByPropertyId: (id: number) => number[]
    getLiturgicalChantIdsByAspectId: (id: number) => number[]
    getCeremonyIdsByAspectId: (id: number) => number[]
  }
> = (
  method,
  character,
  p,
  sourceId,
  index,
  isPartOfDisjunction,
  {
    closeCombatTechniqueIds,
    rangedCombatTechniqueIds,
    getSpellIdsByPropertyId,
    getRitualIdsByPropertyId,
    getLiturgicalChantIdsByAspectId,
    getCeremonyIdsByAspectId,
  },
): void => {
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

  switch (p.targets.tag) {
    case "Skills":
      return p.targets.skills.list.forEach(ref =>
        addOrRemoveDependencyInSlice(
          method,
          character.skills,
          ref.id.skill,
          createEmptyDynamicSkill,
          dependency,
        ),
      )
    case "CombatTechniques":
      switch (p.targets.combat_techniques.group) {
        case "All":
          closeCombatTechniqueIds.forEach(id =>
            addOrRemoveDependencyInSlice(
              method,
              character.combatTechniques.close,
              id,
              createEmptyDynamicCombatTechnique,
              dependency,
            ),
          )
          rangedCombatTechniqueIds.forEach(id =>
            addOrRemoveDependencyInSlice(
              method,
              character.combatTechniques.ranged,
              id,
              createEmptyDynamicCombatTechnique,
              dependency,
            ),
          )
          return
        case "Close":
          return closeCombatTechniqueIds.forEach(id =>
            addOrRemoveDependencyInSlice(
              method,
              character.combatTechniques.close,
              id,
              createEmptyDynamicCombatTechnique,
              dependency,
            ),
          )
        case "Ranged":
          return rangedCombatTechniqueIds.forEach(id =>
            addOrRemoveDependencyInSlice(
              method,
              character.combatTechniques.ranged,
              id,
              createEmptyDynamicCombatTechnique,
              dependency,
            ),
          )
        default:
          return assertExhaustive(p.targets.combat_techniques.group)
      }
    case "Spellworks":
      getSpellIdsByPropertyId(p.targets.spellworks.id.property).forEach(id =>
        addOrRemoveDependencyInSlice(
          method,
          character.spells,
          id,
          createEmptyDynamicSpell,
          dependency,
        ),
      )
      getRitualIdsByPropertyId(p.targets.spellworks.id.property).forEach(id =>
        addOrRemoveDependencyInSlice(
          method,
          character.rituals,
          id,
          createEmptyDynamicSpell,
          dependency,
        ),
      )
      return
    case "Liturgies":
      getLiturgicalChantIdsByAspectId(p.targets.liturgies.id.aspect).forEach(id =>
        addOrRemoveDependencyInSlice(
          method,
          character.liturgicalChants,
          id,
          createEmptyDynamicLiturgicalChant,
          dependency,
        ),
      )
      getCeremonyIdsByAspectId(p.targets.liturgies.id.aspect).forEach(id =>
        addOrRemoveDependencyInSlice(
          method,
          character.ceremonies,
          id,
          createEmptyDynamicLiturgicalChant,
          dependency,
        ),
      )
      return
    default:
      return assertExhaustive(p.targets)
  }
}
