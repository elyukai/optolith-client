import { List } from "../../../Data/List";
import { fromDefault, Record } from "../../../Data/Record";
import { pipe } from "../../Utilities/pipe";
import { ProfessionRequireIncreasable } from "../Wiki/prerequisites/IncreasableRequirement";
import { ProfessionVariantSelections } from "../Wiki/professionSelections/ProfessionVariantAdjustmentSelections";
import { ProfessionVariant } from "../Wiki/ProfessionVariant";
import { ActivatableNameCostIsActive } from "./ActivatableNameCostIsActive";
import { IncreasableForView } from "./IncreasableForView";
import { IncreasableListForView } from "./IncreasableListForView";

export interface ProfessionVariantCombined {
  "@@name": "ProfessionVariantCombined"
  wikiEntry: Record<ProfessionVariant>
  mappedPrerequisites: List<
    Record<ActivatableNameCostIsActive> |
    Record<ProfessionRequireIncreasable>
  >
  mappedSpecialAbilities: List<Record<ActivatableNameCostIsActive>>
  mappedSelections: ProfessionVariant["selections"]
  mappedCombatTechniques: List<Record<IncreasableForView>>
  mappedSkills: List<Record<IncreasableForView>>
  mappedSpells: List<Record<IncreasableForView> | Record<IncreasableListForView>>
  mappedLiturgicalChants: List<Record<IncreasableForView> | Record<IncreasableListForView>>
}

export const ProfessionVariantCombined =
  fromDefault ("ProfessionVariantCombined")
              <ProfessionVariantCombined> ({
                wikiEntry: ProfessionVariant .default,
                mappedPrerequisites: List.empty,
                mappedSpecialAbilities: List.empty,
                mappedSelections: ProfessionVariantSelections.default,
                mappedCombatTechniques: List.empty,
                mappedSkills: List.empty,
                mappedSpells: List.empty,
                mappedLiturgicalChants: List.empty,
              })

export const ProfessionVariantCombinedA_ = {
  id: pipe (ProfessionVariantCombined.A.wikiEntry, ProfessionVariant.A.id),
  name: pipe (ProfessionVariantCombined.A.wikiEntry, ProfessionVariant.A.name),
  ap: pipe (ProfessionVariantCombined.A.wikiEntry, ProfessionVariant.A.ap),
  blessings: pipe (ProfessionVariantCombined.A.wikiEntry, ProfessionVariant.A.blessings),
  precedingText: pipe (ProfessionVariantCombined.A.wikiEntry, ProfessionVariant.A.precedingText),
  concludingText: pipe (ProfessionVariantCombined.A.wikiEntry, ProfessionVariant.A.concludingText),
  fullText: pipe (ProfessionVariantCombined.A.wikiEntry, ProfessionVariant.A.fullText),
}
