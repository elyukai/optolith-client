import { List } from "../../../Data/List";
import { elem, OrderedSet } from "../../../Data/OrderedSet";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { ProfessionRequireIncreasable } from "../Wiki/prerequisites/IncreasableRequirement";
import { Profession } from "../Wiki/Profession";
import { ProfessionSelections } from "../Wiki/professionSelections/ProfessionAdjustmentSelections";
import { ActivatableNameCostIsActive } from "./ActivatableNameCostIsActive";
import { IncreasableForView } from "./IncreasableForView";
import { IncreasableListForView } from "./IncreasableListForView";
import { ProfessionVariantCombined } from "./ProfessionVariantCombined";

export interface ProfessionCombined {
  wikiEntry: Record<Profession>
  mappedAP: List<number> | number
  mappedPrerequisites: List<
    Record<ActivatableNameCostIsActive> |
    Record<ProfessionRequireIncreasable>
  >
  mappedSpecialAbilities: List<Record<ActivatableNameCostIsActive>>
  selections: Profession["selections"]
  mappedCombatTechniques: List<Record<IncreasableForView>>
  mappedPhysicalSkills: List<Record<IncreasableForView>>
  mappedSocialSkills: List<Record<IncreasableForView>>
  mappedNatureSkills: List<Record<IncreasableForView>>
  mappedKnowledgeSkills: List<Record<IncreasableForView>>
  mappedCraftSkills: List<Record<IncreasableForView>>
  mappedSpells: List<Record<IncreasableForView> | Record<IncreasableListForView>>
  mappedLiturgicalChants: List<Record<IncreasableForView> | Record<IncreasableListForView>>
  mappedVariants: List<Record<ProfessionVariantCombined>>
}

export const ProfessionCombined =
  fromDefault<ProfessionCombined> ({
    wikiEntry: Profession .default,
    mappedAP: 0,
    mappedPrerequisites: List.empty,
    mappedSpecialAbilities: List.empty,
    selections: ProfessionSelections.default,
    mappedCombatTechniques: List.empty,
    mappedPhysicalSkills: List.empty,
    mappedSocialSkills: List.empty,
    mappedNatureSkills: List.empty,
    mappedKnowledgeSkills: List.empty,
    mappedCraftSkills: List.empty,
    mappedSpells: List.empty,
    mappedLiturgicalChants: List.empty,
    mappedVariants: List.empty,
  })

export const ProfessionCombinedL = makeLenses (ProfessionCombined)

export const ProfessionCombinedA_ = {
  id: pipe (ProfessionCombined.A.wikiEntry, Profession.A.id),
  gr: pipe (ProfessionCombined.A.wikiEntry, Profession.A.gr),
  subgr: pipe (ProfessionCombined.A.wikiEntry, Profession.A.subgr),
  src: pipe (ProfessionCombined.A.wikiEntry, Profession.A.src),
}

export const isProfessionCombined =
  (x: Record<Profession> | Record<ProfessionCombined>): x is Record<ProfessionCombined> =>
    elem<keyof ProfessionCombined> ("wikiEntry") (x .keys as OrderedSet<keyof ProfessionCombined>)
