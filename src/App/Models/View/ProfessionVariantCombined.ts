import { List } from "../../../Data/List"
import { IncreasablePrerequisite } from "../Wiki/prerequisites/IncreasableRequirement"
import { ProfessionVariant } from "../Wiki/ProfessionVariant"
import { ActivatableNameCostIsActive } from "./ActivatableNameCostIsActive"
import { IncreasableForView } from "./IncreasableForView"
import { IncreasableListForView } from "./IncreasableListForView"

export interface ProfessionVariantCombined {
  wikiEntry: ProfessionVariant
  mappedPrerequisites: List<ActivatableNameCostIsActive | IncreasablePrerequisite>
  mappedSpecialAbilities: List<ActivatableNameCostIsActive>
  mappedSelections: ProfessionVariant["options"]
  mappedCombatTechniques: List<IncreasableForView>
  mappedSkills: List<IncreasableForView>
  mappedSpells: List<IncreasableForView | IncreasableListForView>
  mappedLiturgicalChants: List<IncreasableForView | IncreasableListForView>
}
