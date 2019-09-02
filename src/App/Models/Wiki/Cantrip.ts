import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { Categories } from "../../Constants/Categories";
import { SourceLink } from "./sub/SourceLink";
import { EntryWithCategory } from "./wikiTypeHelpers";

export interface Cantrip {
  "@@name": "Cantrip"
  id: string
  name: string
  property: number
  tradition: List<number>
  category: Categories
  effect: string
  range: string
  duration: string
  target: string
  note: Maybe<string>
  src: List<Record<SourceLink>>
}

export const Cantrip =
  fromDefault ("Cantrip")
              <Cantrip> ({
                id: "",
                name: "",
                property: 0,
                tradition: List.empty,
                category: Categories.CANTRIPS,
                effect: "",
                range: "",
                duration: "",
                target: "",
                note: Nothing,
                src: List.empty,
              })

export const isCantrip =
  (r: EntryWithCategory) => Cantrip.AL.category (r) === Categories.CANTRIPS
