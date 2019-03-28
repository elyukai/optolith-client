import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { Application } from "./sub/Application";
import { SourceLink } from "./sub/SourceLink";
import { EntryWithCategory } from "./wikiTypeHelpers";

export interface Skill {
  id: string
  name: string
  category: Categories
  check: List<string>
  encumbrance: string
  gr: number
  ic: number
  applications: List<Record<Application>>
  applicationsInput: Maybe<string>
  tools: Maybe<string>
  quality: string
  failed: string
  critical: string
  botch: string
  src: List<Record<SourceLink>>
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
    applications: List.empty,
    applicationsInput: Nothing,
    tools: Nothing,
    quality: "",
    failed: "",
    critical: "",
    botch: "",
    src: List.empty,
  })

export const isSkill =
  (r: EntryWithCategory) => Skill.AL.category (r) === Categories.TALENTS
