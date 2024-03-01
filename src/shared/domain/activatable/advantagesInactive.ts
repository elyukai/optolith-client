import { ResolvedSelectOption } from "optolith-database-schema/cache/activatableSelectOptions"
import { Advantage } from "optolith-database-schema/types/Advantage"
import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { PublicationRefs } from "optolith-database-schema/types/source/_PublicationRef"
import { FilterApplyingActivatableDependencies } from "../dependencies/filterApplyingDependencies.ts"
import { All, GetById } from "../getTypes.ts"
import { getCreateIdentifierObject } from "../identifier.ts"
import {
  checkPrerequisitesOfAdvantageOrDisadvantage,
  checkPrerequisitesOfGeneralEntryWithLevels,
} from "../prerequisites/fullPrerequisiteValidationForType.ts"
import { DisplayedInactiveActivatable, getInactiveActivatables } from "./activatableInactive.ts"

/**
 * A combination of a static advantage and its dynamic counterpart, extended by
 * whether the entry can be activated and configuration options.
 */
export type DisplayedInactiveAdvantage = DisplayedInactiveActivatable<"Advantage", Advantage>

/**
 * Returns all advantages with their corresponding dynamic entry, extended by
 * whether the entry can be activated and configuration options.
 */
export const getInactiveAdvantages = (
  staticAdvantages: All.Static.Advantages,
  getDynamicAdvantageById: GetById.Dynamic.Advantage,
  isEntryAvailable: (src: PublicationRefs) => boolean,
  prerequisiteCapabilities: Parameters<typeof checkPrerequisitesOfAdvantageOrDisadvantage>[4],
  getSelectOptionsById: (id: ActivatableIdentifier) => ResolvedSelectOption[] | undefined,
  filterApplyingDependencies: FilterApplyingActivatableDependencies,
  caps: {
    activeSermonsCount: number
    activeVisionsCount: number
    activeSpellworksCount: number
    getDynamicAdvantageById: GetById.Dynamic.Advantage
    getDynamicDisadvantageById: GetById.Dynamic.Disadvantage
  },
): DisplayedInactiveAdvantage[] =>
  getInactiveActivatables(
    "Advantage",
    staticAdvantages,
    getDynamicAdvantageById,
    isEntryAvailable,
    (prerequisites, level, id) =>
      checkPrerequisitesOfAdvantageOrDisadvantage(
        prerequisites,
        level,
        "Advantage",
        id,
        prerequisiteCapabilities,
      ),
    prerequisites =>
      checkPrerequisitesOfGeneralEntryWithLevels(prerequisites, 1, prerequisiteCapabilities),
    getSelectOptionsById,
    getCreateIdentifierObject("Advantage"),
    filterApplyingDependencies,
    1,
    caps,
  )
