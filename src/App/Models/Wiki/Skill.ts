import { List } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, Record } from "../../../Data/Record"
import { Category } from "../../Constants/Categories"
import { Application } from "./sub/Application"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"
import { EntryWithCategory } from "./wikiTypeHelpers"

export interface Skill {
  "@@name": "Skill"
  id: string
  name: string
  category: Category
  check: List<string>
  encumbrance: string
  encumbranceDescription: Maybe<string>
  gr: number
  ic: number
  applications: List<Record<Application>>
  applicationsInput: Maybe<string>
  uses: List<Record<Application>>
  tools: Maybe<string>
  quality: string
  failed: string
  critical: string
  botch: string
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

export const Skill =
  fromDefault ("Skill")
              <Skill> ({
                id: "",
                name: "",
                category: Category.SKILLS,
                check: List.empty,
                encumbrance: "",
                encumbranceDescription: Nothing,
                gr: 0,
                ic: 0,
                applications: List.empty,
                applicationsInput: Nothing,
                uses: List.empty,
                tools: Nothing,
                quality: "",
                failed: "",
                critical: "",
                botch: "",
                src: List.empty,
                errata: List (),
              })

export const isSkill =
  (r: EntryWithCategory) => Skill.AL.category (r) === Category.SKILLS
