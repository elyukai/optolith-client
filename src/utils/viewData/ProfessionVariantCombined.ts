import { ActivatableNameCostActive } from "../../types/data";
import { List } from "../structures/List";
import { fromDefault, Record } from "../structures/Record";
import { ProfessionRequireIncreasable } from "../wikiData/prerequisites/IncreasableRequirement";
import { ProfessionVariant } from "../wikiData/ProfessionVariant";
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
