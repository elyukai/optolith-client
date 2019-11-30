import { List } from "../../../Data/List";
import { Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { Category } from "../../Constants/Categories";
import { Erratum } from "./sub/Errata";
import { SourceLink } from "./sub/SourceLink";
import { EntryWithCategory } from "./wikiTypeHelpers";

export interface CombatTechnique {
  "@@name": "CombatTechnique"
  id: string
  name: string
  category: Category
  gr: number
  ic: number
  bpr: number
  primary: List<string>
  special: Maybe<string>
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

export const CombatTechnique =
  fromDefault ("CombatTechnique")
              <CombatTechnique> ({
                id: "",
                name: "",
                category: Category.COMBAT_TECHNIQUES,
                gr: 0,
                ic: 0,
                bpr: 0,
                primary: List.empty,
                special: Nothing,
                src: List.empty,
                errata: List (),
              })

export const isCombatTechnique =
  (r: EntryWithCategory) => CombatTechnique.AL.category (r) === Category.COMBAT_TECHNIQUES
