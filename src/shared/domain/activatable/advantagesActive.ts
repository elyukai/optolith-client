import { ResolvedSelectOption } from "optolith-database-schema/cache/activatableSelectOptions"
import { Advantage } from "optolith-database-schema/types/Advantage"
import { ActivatableIdentifier } from "optolith-database-schema/types/_IdentifierGroup"
import { FilterApplyingActivatableDependencies } from "../dependencies/filterApplyingDependencies.ts"
import { All, GetById, Singleton } from "../getTypes.ts"
import { getCreateIdentifierObject } from "../identifier.ts"
import { checkPrerequisitesOfAdvantageOrDisadvantage } from "../prerequisites/fullPrerequisiteValidationForType.ts"
import { DisplayedActiveActivatable, getActiveActivatables } from "./activatableActive.ts"

/**
 * A combination of a static advantage and its dynamic counterpart, extended by
 * which activation/instance of the entry it represents.
 */
export type DisplayedActiveAdvantage = DisplayedActiveActivatable<Advantage>

/**
 * Returns all advantages with their corresponding dynamic entry, extended by
 * which activation/instance of the entry it represents.
 */
export const getActiveAdvantages = (
  getStaticAdvantageById: GetById.Static.Advantage,
  dynamicAdvantages: All.Dynamic.Advantages,
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
): DisplayedActiveAdvantage[] =>
  getActiveActivatables(
    getStaticAdvantageById,
    dynamicAdvantages,
    (prerequisites, level, id) =>
      checkPrerequisitesOfAdvantageOrDisadvantage(
        prerequisites,
        level,
        "Advantage",
        id,
        prerequisiteCapabilities,
      ),
    getSelectOptionsById,
    getCreateIdentifierObject("Advantage"),
    filterApplyingDependencies,
    t10n => t10n.name,
    caps,
  )
