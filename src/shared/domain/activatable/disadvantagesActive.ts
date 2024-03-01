import { ResolvedSelectOption } from "optolith-database-schema/cache/activatableSelectOptions"
import { Disadvantage } from "optolith-database-schema/types/Disadvantage"
import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { FilterApplyingActivatableDependencies } from "../dependencies/filterApplyingDependencies.ts"
import { All, GetById, Singleton } from "../getTypes.ts"
import { getCreateIdentifierObject } from "../identifier.ts"
import { checkPrerequisitesOfAdvantageOrDisadvantage } from "../prerequisites/fullPrerequisiteValidationForType.ts"
import { DisplayedActiveActivatable, getActiveActivatables } from "./activatableActive.ts"

/**
 * A combination of a static disadvantage and its dynamic counterpart, extended by
 * which activation/instance of the entry it represents.
 */
export type DisplayedActiveDisadvantage = DisplayedActiveActivatable<"Disadvantage", Disadvantage>

/**
 * Returns all disadvantages with their corresponding dynamic entry, extended by
 * which activation/instance of the entry it represents.
 */
export const getActiveDisadvantages = (
  getStaticDisadvantageById: GetById.Static.Disadvantage,
  dynamicDisadvantages: All.Dynamic.Disadvantages,
  prerequisiteCapabilities: Parameters<typeof checkPrerequisitesOfAdvantageOrDisadvantage>[4],
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
): DisplayedActiveDisadvantage[] =>
  getActiveActivatables(
    "Disadvantage",
    getStaticDisadvantageById,
    dynamicDisadvantages,
    (prerequisites, level, id) =>
      checkPrerequisitesOfAdvantageOrDisadvantage(
        prerequisites,
        level,
        "Disadvantage",
        id,
        prerequisiteCapabilities,
      ),
    getSelectOptionsById,
    getCreateIdentifierObject("Disadvantage"),
    filterApplyingDependencies,
    t10n => t10n.name,
    caps,
  )
