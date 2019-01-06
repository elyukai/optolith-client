import { List } from "../../../Data/List";
import { fromDefault, Record } from "../../../Data/Record";
import { ActivatableNameCostActive } from "../Hero/heroTypeHelpers";
import { ProfessionRequireIncreasable } from "../Wiki/prerequisites/IncreasableRequirement";
import { ProfessionVariant } from "../Wiki/ProfessionVariant";
import { IncreasableForView } from "./IncreasableForView";

export interface ProfessionVariantCombined {
  wikiEntry: Record<ProfessionVariant>
  mappedPrerequisites: List<
    Record<ActivatableNameCostActive> |
    Record<ProfessionRequireIncreasable>
  >
  mappedSpecialAbilities: List<Record<ActivatableNameCostActive>>
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
