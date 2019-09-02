import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { CommonProfession } from "./sub/CommonProfession";
import { IncreaseSkill } from "./sub/IncreaseSkill";
import { SourceLink } from "./sub/SourceLink";
import { EntryWithCategory } from "./wikiTypeHelpers";

export interface Culture {
  "@@name": "Culture"
  id: string
  name: string
  culturalPackageAdventurePoints: number
  languages: List<number>
  scripts: List<number>
  socialStatus: List<number>
  areaKnowledge: string
  areaKnowledgeShort: string
  commonProfessions: List<boolean | Record<CommonProfession>>
  commonMundaneProfessions: Maybe<string>
  commonMagicProfessions: Maybe<string>
  commonBlessedProfessions: Maybe<string>
  commonAdvantages: List<string>
  commonAdvantagesText: Maybe<string>
  commonDisadvantages: List<string>
  commonDisadvantagesText: Maybe<string>
  uncommonAdvantages: List<string>
  uncommonAdvantagesText: Maybe<string>
  uncommonDisadvantages: List<string>
  uncommonDisadvantagesText: Maybe<string>
  commonSkills: List<string>
  uncommonSkills: List<string>

  /**
   * Markdown supported.
   */
  commonNames: string
  culturalPackageSkills: List<Record<IncreaseSkill>>
  category: Categories
  src: List<Record<SourceLink>>
}

export const Culture =
  fromDefault ("Culture")
              <Culture> ({
                id: "",
                name: "",
                culturalPackageAdventurePoints: 0,
                languages: List.empty,
                scripts: List.empty,
                socialStatus: List.empty,
                areaKnowledge: "",
                areaKnowledgeShort: "",
                commonProfessions: List.empty,
                commonMundaneProfessions: Nothing,
                commonMagicProfessions: Nothing,
                commonBlessedProfessions: Nothing,
                commonAdvantages: List.empty,
                commonAdvantagesText: Nothing,
                commonDisadvantages: List.empty,
                commonDisadvantagesText: Nothing,
                uncommonAdvantages: List.empty,
                uncommonAdvantagesText: Nothing,
                uncommonDisadvantages: List.empty,
                uncommonDisadvantagesText: Nothing,
                commonSkills: List.empty,
                uncommonSkills: List.empty,
                commonNames: "",
                culturalPackageSkills: List.empty,
                category: Categories.CULTURES,
                src: List.empty,
              })

export const CultureL = makeLenses (Culture)

export const isCulture =
  (r: EntryWithCategory) => Culture.AL.category (r) === Categories.CULTURES
