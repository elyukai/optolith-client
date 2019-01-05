import { Categories } from "../../../constants/Categories";
import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { Application } from "./sub/Application";
import { EntryWithCategory } from "./wikiTypeHelpers";

export interface Skill {
  id: string
  name: string
  category: Categories
  check: List<string>
  encumbrance: string
  gr: number
  ic: number
  applications: Maybe<List<Record<Application>>>
  applicationsInput: Maybe<string>
  tools: Maybe<string>
  quality: string
  failed: string
  critical: string
  botch: string
  src: string
}

export const Skill =
  fromDefault<Skill> ({
    id: "",
    name: "",
    category: Categories.TALENTS,
    check: List.empty,
    encumbrance: "",
    gr: 0,
    ic: 0,
    applications: Nothing,
    applicationsInput: Nothing,
    tools: Nothing,
    quality: "",
    failed: "",
    critical: "",
    botch: "",
    src: "",
  })

export const isSkill =
  (r: EntryWithCategory) => Skill.A.category (r) === Categories.TALENTS
