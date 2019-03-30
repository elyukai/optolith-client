import { List } from "../../../Data/List";
import { fromDefault, Record } from "../../../Data/Record";
import { ProfessionRequireIncreasable } from "../Wiki/prerequisites/IncreasableRequirement";
import { ProfessionVariant } from "../Wiki/ProfessionVariant";
import { ActivatableNameCostIsActive } from "./ActivatableNameCostIsActive";
import { IncreasableForView } from "./IncreasableForView";

export interface ProfessionVariantCombined {
  wikiEntry: Record<ProfessionVariant>
  mappedPrerequisites: List<
    Record<ActivatableNameCostIsActive> |
    Record<ProfessionRequireIncreasable>
  >
  mappedSpecialAbilities: List<Record<ActivatableNameCostIsActive>>
  selections: ProfessionVariant["selections"]
  mappedCombatTechniques: List<Record<IncreasableForView>>
  mappedSkills: List<Record<IncreasableForView>>
  mappedSpells: List<Record<IncreasableForView>>
  mappedLiturgicalChants: List<Record<IncreasableForView>>
}

export const ProfessionVariantCombined =
  fromDefault<ProfessionVariantCombined> ({
    wikiEntry: ProfessionVariant .default,
    mappedPrerequisites: List.empty,
    mappedSpecialAbilities: List.empty,
    selections: List.empty,
    mappedCombatTechniques: List.empty,
    mappedSkills: List.empty,
    mappedSpells: List.empty,
    mappedLiturgicalChants: List.empty,
  })
