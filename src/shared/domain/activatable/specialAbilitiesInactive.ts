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
import { GetById } from "../getTypes.ts"
import { getCreateIdentifierObject } from "../identifier.ts"
import { checkPrerequisitesOfGeneralEntryWithLevels } from "../prerequisites/fullPrerequisiteValidationForType.ts"
import { Activatable } from "./activatableEntry.ts"
import { DisplayedInactiveActivatable, getInactiveActivatables } from "./activatableInactive.ts"
import { SpecialAbilityTagTypeMap } from "./specialAbilities.ts"

/**
 * A combination of a static special ability and its dynamic counterpart,
 * extended by whether the entry can be activated and configuration options.
 */
export type DisplayedInactiveSpecialAbility = {
  [K in keyof SpecialAbilityTagTypeMap]: DisplayedInactiveActivatable<
    K,
    SpecialAbilityTagTypeMap[K]
  >
}[keyof SpecialAbilityTagTypeMap]

/**
 * Returns all disadvantages with their corresponding dynamic entry, extended by
 * whether the entry can be activated and configuration options.
 */
export const getInactiveSpecialAbilities = <
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
  staticSpecialAbilities: T[],
  getDynamicSpecialAbilityById: (id: number) => Activatable | undefined,
  isEntryAvailable: (src: PublicationRefs) => boolean,
  prerequisiteCapabilities: Parameters<typeof checkPrerequisitesOfGeneralEntryWithLevels>[2],
  getSelectOptionsById: (id: ActivatableIdentifier) => ResolvedSelectOption[] | undefined,
  filterApplyingDependencies: FilterApplyingActivatableDependencies,
  caps: {
    activeSermonsCount: number
    activeVisionsCount: number
    activeSpellworksCount: number
    getDynamicAdvantageById: GetById.Dynamic.Advantage
    getDynamicDisadvantageById: GetById.Dynamic.Disadvantage
  },
): DisplayedInactiveActivatable<K, T>[] =>
  getInactiveActivatables<K, T, PrerequisiteForLevel<GeneralPrerequisiteGroup>>(
    kind,
    staticSpecialAbilities,
    getDynamicSpecialAbilityById,
    isEntryAvailable,
    (prerequisites, level) =>
      checkPrerequisitesOfGeneralEntryWithLevels(prerequisites, level, prerequisiteCapabilities),
    prerequisites =>
      checkPrerequisitesOfGeneralEntryWithLevels(prerequisites, 1, prerequisiteCapabilities),
    getSelectOptionsById,
    getCreateIdentifierObject(kind),
    filterApplyingDependencies,
    Infinity,
    caps,
  )
