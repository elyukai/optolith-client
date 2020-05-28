import { List } from "../../../Data/List"
import { IncreasablePrerequisite } from "../Wiki/prerequisites/IncreasableRequirement"
import { Profession } from "../Wiki/Profession"
import { ActivatableNameCostIsActive } from "./ActivatableNameCostIsActive"
import { IncreasableForView } from "./IncreasableForView"
import { IncreasableListForView } from "./IncreasableListForView"
import { ProfessionVariantCombined } from "./ProfessionVariantCombined"

export interface ProfessionCombined {
  wikiEntry: Profession
  mappedAP: List<number> | number
  mappedPrerequisites: List<ActivatableNameCostIsActive | IncreasablePrerequisite>
  mappedSpecialAbilities: List<ActivatableNameCostIsActive>
  mappedSelections: Profession["options"]
  mappedCombatTechniques: List<IncreasableForView>
  mappedPhysicalSkills: List<IncreasableForView>
  mappedSocialSkills: List<IncreasableForView>
  mappedNatureSkills: List<IncreasableForView>
  mappedKnowledgeSkills: List<IncreasableForView>
  mappedCraftSkills: List<IncreasableForView>
  mappedSpells: List<IncreasableForView | IncreasableListForView>
  mappedLiturgicalChants: List<IncreasableForView | IncreasableListForView>
  mappedVariants: List<ProfessionVariantCombined>
}
