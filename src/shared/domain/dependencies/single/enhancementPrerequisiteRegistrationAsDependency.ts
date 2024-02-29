import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import {
  ExternalEnhancementPrerequisite,
  InternalEnhancementPrerequisite,
} from "optolith-database-schema/types/prerequisites/single/EnhancementPrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { EnhancementDependency } from "../../rated/enhancement.ts"
import { createEmptyDynamicLiturgicalChant } from "../../rated/liturgicalChant.ts"
import { createEmptyDynamicSpell } from "../../rated/spell.ts"
import { RegistrationFunction, addOrRemoveDependency } from "../registrationHelpers.ts"

/**
 * Registers or unregisters an {@link ExternalEnhancementPrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterExternalEnhancementPrerequisiteAsDependency: RegistrationFunction<
  ExternalEnhancementPrerequisite,
  ActivatableIdentifier
> = (method, character, p, sourceId, index, isPartOfDisjunction): void => {
  const dependency: EnhancementDependency = {
    tag: "External",
    sourceId,
    index,
    isPartOfDisjunction,
  }

  const addOrRemoveDependencyInSlice = <
    K extends string | number | symbol,
    T extends { enhancements: Record<number, { dependencies: EnhancementDependency[] }> },
  >(
    slice: Record<K, T>,
    id: K,
    createDefault: (id: K) => T,
  ): void => {
    const entry = (slice[id] ??= createDefault(id))
    if (Object.hasOwn(entry.enhancements, p.enhancement.id)) {
      addOrRemoveDependency(method, entry.enhancements[p.enhancement.id]!.dependencies, dependency)
    }
  }

  switch (p.skill.id.tag) {
    case "Spell":
      return addOrRemoveDependencyInSlice(
        character.spells,
        p.skill.id.spell,
        createEmptyDynamicSpell,
      )
    case "Ritual":
      return addOrRemoveDependencyInSlice(
        character.rituals,
        p.skill.id.ritual,
        createEmptyDynamicSpell,
      )
    case "LiturgicalChant":
      return addOrRemoveDependencyInSlice(
        character.liturgicalChants,
        p.skill.id.liturgical_chant,
        createEmptyDynamicLiturgicalChant,
      )
    case "Ceremony":
      return addOrRemoveDependencyInSlice(
        character.ceremonies,
        p.skill.id.ceremony,
        createEmptyDynamicLiturgicalChant,
      )
    default:
      return assertExhaustive(p.skill.id)
  }
}

/**
 * Registers or unregisters an {@link InternalEnhancementPrerequisite} as a
 * dependency on the character's draft.
 */
export const registerOrUnregisterInfluencePrerequisiteAsDependency: RegistrationFunction<
  InternalEnhancementPrerequisite,
  number
> = (): void => {
  // TODO: Missing implementation
}
