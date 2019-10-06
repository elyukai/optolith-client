import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { ProfessionRequireActivatable } from "./prerequisites/ActivatableRequirement";
import { ProfessionVariantSelections } from "./professionSelections/ProfessionVariantAdjustmentSelections";
import { IncreaseSkill } from "./sub/IncreaseSkill";
import { IncreaseSkillList } from "./sub/IncreaseSkillList";
import { NameBySex } from "./sub/NameBySex";
import { EntryWithCategory, ProfessionDependency, ProfessionPrerequisite } from "./wikiTypeHelpers";

export interface ProfessionVariant {
  "@@name": "ProfessionVariant"
  id: string
  name: string | Record<NameBySex>
  ap: number
  dependencies: List<ProfessionDependency>
  prerequisites: List<ProfessionPrerequisite>
  selections: Record<ProfessionVariantSelections>
  specialAbilities: List<Record<ProfessionRequireActivatable>>
  combatTechniques: List<Record<IncreaseSkill>>
  skills: List<Record<IncreaseSkill>>
  spells: List<Record<IncreaseSkill> | Record<IncreaseSkillList>>
  liturgicalChants: List<Record<IncreaseSkill> | Record<IncreaseSkillList>>
  blessings: List<string>
  precedingText: Maybe<string>
  fullText: Maybe<string>
  concludingText: Maybe<string>
  category: Categories
}

export const ProfessionVariant =
  fromDefault ("ProfessionVariant")
              <ProfessionVariant> ({
                id: "",
                name: "",
                ap: 0,
                dependencies: List.empty,
                prerequisites: List.empty,
                selections: ProfessionVariantSelections.default,
                specialAbilities: List.empty,
                combatTechniques: List.empty,
                skills: List.empty,
                spells: List.empty,
                liturgicalChants: List.empty,
                blessings: List.empty,
                precedingText: Nothing,
                fullText: Nothing,
                concludingText: Nothing,
                category: Categories.PROFESSION_VARIANTS,
              })

export const ProfessionVariantL = makeLenses (ProfessionVariant)

export const isProfessionVariant =
  (r: EntryWithCategory) => ProfessionVariant.AL.category (r) === Categories.PROFESSION_VARIANTS
