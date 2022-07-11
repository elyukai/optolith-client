import { List } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { sel1, sel2, sel3 } from "../../../Data/Tuple/All"
import { MagicalGroup, MagicalTradition, Property } from "../../Constants/Groups"
import { ndash } from "../../Utilities/Chars"
import { ImprovementCost } from "../../Utilities/ImprovementCost"
import { Spell } from "./Spell"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"
import { CheckModifier } from "./wikiTypeHelpers"

export const CurseIC = ImprovementCost.B

export interface Curse {
  "@@name": "Curse"
  id: string
  name: string
  check: Tuple<[string, string, string]>
  checkmod: Maybe<CheckModifier>
  property: Property
  effect: string
  cost: string
  costShort: string
  duration: string
  durationShort: string
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Curse =
  fromDefault ("Curse")
              <Curse> ({
                id: "",
                name: "",
                check: Tuple ("", "", ""),
                checkmod: Nothing,
                property: 0,
                effect: "",
                cost: "",
                costShort: "",
                duration: "",
                durationShort: "",
                src: List.empty,
                errata: List (),
              })

export const curseToSpell = (x: Record<Curse>): Record<Spell> => Spell ({
                              id: Curse.A.id (x),
                              name: Curse.A.name (x),
                              check: List (
                                sel1 (Curse.A.check (x)),
                                sel2 (Curse.A.check (x)),
                                sel3 (Curse.A.check (x)),
                              ),
                              checkmod: Curse.A.checkmod (x),
                              gr: MagicalGroup.Curses,
                              ic: CurseIC,
                              property: Curse.A.property (x),
                              tradition: List (MagicalTradition.Witches),
                              subtradition: List (),
                              prerequisites: List (),
                              effect: Curse.A.effect (x),
                              castingTime: ndash,
                              castingTimeShort: ndash,
                              castingTimeNoMod: false,
                              cost: Curse.A.cost (x),
                              costShort: Curse.A.costShort (x),
                              costNoMod: false,
                              range: ndash,
                              rangeShort: ndash,
                              rangeNoMod: false,
                              duration: Curse.A.duration (x),
                              durationShort: Curse.A.durationShort (x),
                              durationNoMod: false,
                              target: ndash,
                              src: Curse.A.src (x),
                              errata: Curse.A.errata (x),
                              category: Nothing,
                            })
