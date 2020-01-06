import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { Tuple } from "../../../Data/Tuple";
import { Erratum } from "./sub/Errata";
import { SourceLink } from "./sub/SourceLink";

export interface Condition {
  "@@name": "Condition"
  id: string
  name: string
  description: Maybe<string>
  levelColumnDescription: string
  levelDescriptions: Tuple<[string, string, string, string]>
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

export const Condition =
  fromDefault ("Condition")
              <Condition> ({
                id: "",
                name: "",
                description: Nothing,
                levelColumnDescription: "",
                levelDescriptions: Tuple ("", "", "", ""),
                src: List (),
                errata: List (),
              })
