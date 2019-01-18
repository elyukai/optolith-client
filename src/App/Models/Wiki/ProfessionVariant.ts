import { Categories } from "../../../constants/Categories";
import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { ProfessionRequireActivatable } from "./prerequisites/ActivatableRequirement";
import { IncreaseSkill } from "./sub/IncreaseSkill";
import { NameBySex } from "./sub/NameBySex";
import { EntryWithCategory, ProfessionDependency, ProfessionPrerequisite, ProfessionVariantSelectionList } from "./wikiTypeHelpers";

export interface ProfessionVariant {
  id: string
  name: string | Record<NameBySex>
  ap: number
  dependencies: List<ProfessionDependency>
  prerequisites: List<ProfessionPrerequisite>
  selections: ProfessionVariantSelectionList
  specialAbilities: List<Record<ProfessionRequireActivatable>>
  combatTechniques: List<Record<IncreaseSkill>>
  skills: List<Record<IncreaseSkill>>
  spells: List<Record<IncreaseSkill>>
  liturgicalChants: List<Record<IncreaseSkill>>
  blessings: List<string>
  precedingText: Maybe<string>
  fullText: Maybe<string>
  concludingText: Maybe<string>
  category: Categories
}

export const ProfessionVariant =
  fromDefault<ProfessionVariant> ({
    id: "",
    name: "",
    ap: 0,
    dependencies: List.empty,
    prerequisites: List.empty,
    selections: List.empty,
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

export const isProfessionVariant =
  (r: EntryWithCategory) => ProfessionVariant.A.category (r) === Categories.PROFESSION_VARIANTS
