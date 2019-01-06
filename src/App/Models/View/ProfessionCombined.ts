import { List } from "../../../Data/List";
import { fromDefault, Record } from "../../../Data/Record";
import { ActivatableNameCostActive } from "../Hero/heroTypeHelpers";
import { ProfessionRequireIncreasable } from "../Wiki/prerequisites/IncreasableRequirement";
import { Profession } from "../Wiki/Profession";
import { IncreasableForView } from "./IncreasableForView";
import { ProfessionVariantCombined } from "./ProfessionVariantCombined";

export interface ProfessionCombined {
  wikiEntry: Record<Profession>
  mappedPrerequisites: List<
    Record<ActivatableNameCostActive> |
    Record<ProfessionRequireIncreasable>
  >
  mappedSpecialAbilities: List<Record<ActivatableNameCostActive>>
  selections: Profession["selections"]
  mappedCombatTechniques: List<Record<IncreasableForView>>
  mappedPhysicalSkills: List<Record<IncreasableForView>>
  mappedSocialSkills: List<Record<IncreasableForView>>
  mappedNatureSkills: List<Record<IncreasableForView>>
  mappedKnowledgeSkills: List<Record<IncreasableForView>>
  mappedCraftSkills: List<Record<IncreasableForView>>
  mappedSpells: List<Record<IncreasableForView>>
  mappedLiturgicalChants: List<Record<IncreasableForView>>
  mappedVariants: List<Record<ProfessionVariantCombined>>
}

export const ProfessionCombined =
  fromDefault<ProfessionCombined> ({
    wikiEntry: Profession .default,
    mappedPrerequisites: List.empty,
    mappedSpecialAbilities: List.empty,
    selections: List.empty,
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
