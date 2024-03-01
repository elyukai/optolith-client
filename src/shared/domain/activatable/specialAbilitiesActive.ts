import { ResolvedSelectOption } from "optolith-database-schema/cache/activatableSelectOptions"
import { AdventurePointsValue } from "optolith-database-schema/types/_Activatable"
import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"
import {
  GeneralPrerequisites,
  PrerequisiteForLevel,
} from "optolith-database-schema/types/_Prerequisite"
import { GeneralPrerequisiteGroup } from "optolith-database-schema/types/prerequisites/PrerequisiteGroups"
import { PublicationRefs } from "optolith-database-schema/types/source/_PublicationRef"
import { FilterApplyingActivatableDependencies } from "../dependencies/filterApplyingDependencies.ts"
import { GetById, Singleton } from "../getTypes.ts"
import { getCreateIdentifierObject } from "../identifier.ts"
import { checkPrerequisitesOfGeneralEntryWithLevels } from "../prerequisites/fullPrerequisiteValidationForType.ts"
import { DisplayedActiveActivatable, getActiveActivatables } from "./activatableActive.ts"
import { Activatable } from "./activatableEntry.ts"
import { SpecialAbilityTagTypeMap } from "./specialAbilities.ts"

/**
 * A combination of a static disadvantage and its dynamic counterpart, extended by
 * which activation/instance of the entry it represents.
 */
export type DisplayedActiveSpecialAbility = {
  [K in keyof SpecialAbilityTagTypeMap]: DisplayedActiveActivatable<K, SpecialAbilityTagTypeMap[K]>
}[keyof SpecialAbilityTagTypeMap]

/**
 * Returns all disadvantages with their corresponding dynamic entry, extended by
 * which activation/instance of the entry it represents.
 */
export const getActiveSpecialAbilities = <
  K extends keyof SpecialAbilityTagTypeMap,
  T extends {
    id: number
    maximum?: number
    levels?: number
    prerequisites?: GeneralPrerequisites
    ap_value: AdventurePointsValue | number
    src: PublicationRefs
    translations: LocaleMap<{ name: string; input?: string }>
  },
>(
  kind: K,
  getStaticSpecialAbilityById: (id: number) => T | undefined,
  dynamicSpecialAbilities: Activatable[],
  prerequisiteCapabilities: Parameters<typeof checkPrerequisitesOfGeneralEntryWithLevels>[2],
  getSelectOptionsById: (id: ActivatableIdentifier) => ResolvedSelectOption[] | undefined,
  filterApplyingDependencies: FilterApplyingActivatableDependencies,
  caps: {
    startExperienceLevel?: Singleton.Static.ExperienceLevel
    activeSermonsCount: number
    activeVisionsCount: number
    activeCantripsCount: number
    activeSpellworksCount: number
    activeMagicalActionsCount: number
    activeBlessingsCount: number
    activeLiturgicalChantsCount: number
    activeCeremoniesCount: number
    getDynamicSkillById: GetById.Dynamic.Skill
    getDynamicLiturgicalChantById: GetById.Dynamic.LiturgicalChant
    getDynamicCeremonyById: GetById.Dynamic.Ceremony
    getDynamicSpellById: GetById.Dynamic.Spell
    getDynamicRitualById: GetById.Dynamic.Ritual
    getDynamicCloseCombatTechniqueById: GetById.Dynamic.CloseCombatTechnique
    getDynamicRangedCombatTechniqueById: GetById.Dynamic.RangedCombatTechnique
  },
): DisplayedActiveActivatable<K, T>[] =>
  getActiveActivatables<
    K,
    T,
    PrerequisiteForLevel<GeneralPrerequisiteGroup>,
    { name: string; input?: string }
  >(
    kind,
    getStaticSpecialAbilityById,
    dynamicSpecialAbilities,
    (prerequisites, level) =>
      checkPrerequisitesOfGeneralEntryWithLevels(prerequisites, level, prerequisiteCapabilities),
    getSelectOptionsById,
    getCreateIdentifierObject(kind),
    filterApplyingDependencies,
    t10n => t10n.name,
    caps,
  )
