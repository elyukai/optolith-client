import { ResolvedSelectOption } from "optolith-database-schema/cache/activatableSelectOptions"
import { Disadvantage } from "optolith-database-schema/types/Disadvantage"
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
 * A combination of a static disadvantage and its dynamic counterpart, extended
 * by whether the entry can be activated and configuration options.
 */
export type DisplayedInactiveDisadvantage = DisplayedInactiveActivatable<
  "Disadvantage",
  Disadvantage
>

/**
 * Returns all disadvantages with their corresponding dynamic entry, extended by
 * whether the entry can be activated and configuration options.
 */
export const getInactiveDisadvantages = (
  staticDisadvantages: All.Static.Disadvantages,
  getDynamicDisadvantageById: GetById.Dynamic.Disadvantage,
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
): DisplayedInactiveDisadvantage[] =>
  getInactiveActivatables(
    "Disadvantage",
    staticDisadvantages,
    getDynamicDisadvantageById,
    isEntryAvailable,
    (prerequisites, level, id) =>
      checkPrerequisitesOfAdvantageOrDisadvantage(
        prerequisites,
        level,
        "Disadvantage",
        id,
        prerequisiteCapabilities,
      ),
    prerequisites =>
      checkPrerequisitesOfGeneralEntryWithLevels(prerequisites, 1, prerequisiteCapabilities),
    getSelectOptionsById,
    getCreateIdentifierObject("Disadvantage"),
    filterApplyingDependencies,
    1,
    caps,
  )
