import { List } from "../../../Data/List"
import { Nothing } from "../../../Data/Maybe"
import { fromDefault, Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { sel1, sel2, sel3 } from "../../../Data/Tuple/All"
import { icToJs, MagicalGroup, MagicalTradition, Property } from "../../Constants/Groups"
import { ndash } from "../../Utilities/Chars"
import { t as IC } from "../../Utilities/IC.gen"
import { Spell } from "./Spell"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"

export interface AnimistForce {
  "@@name": "AnimistForce"
  id: string
  name: string
  check: Tuple<[string, string, string]>
  ic: IC
  property: Property

  /**
   * If list of tribes is empty, all tribes can have this force.
   */
  tribes: List<number>
  effect: string
  cost: string
  costShort: string
  duration: string
  durationShort: string
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const AnimistForce =
  fromDefault ("AnimistForce")
              <AnimistForce> ({
                id: "",
                name: "",
                check: Tuple ("", "", ""),
                ic: "A",
                property: 0,
                tribes: List.empty,
                effect: "",
                cost: "",
                costShort: "",
                duration: "",
                durationShort: "",
                src: List.empty,
                errata: List (),
              })

export const animistForceToSpell = (x: Record<AnimistForce>): Record<Spell> => Spell ({
                                     id: AnimistForce.A.id (x),
                                     name: AnimistForce.A.name (x),
                                     check: List (
                                       sel1 (AnimistForce.A.check (x)),
                                       sel2 (AnimistForce.A.check (x)),
                                       sel3 (AnimistForce.A.check (x)),
                                     ),
                                     checkmod: Nothing,
                                     gr: MagicalGroup.AnimistForces,
                                     ic: icToJs (AnimistForce.A.ic (x)),
                                     property: AnimistForce.A.property (x),
                                     tradition: List (MagicalTradition.Animists),
                                     subtradition: AnimistForce.A.tribes (x),
                                     prerequisites: List (),
                                     effect: AnimistForce.A.effect (x),
                                     castingTime: ndash,
                                     castingTimeShort: ndash,
                                     castingTimeNoMod: false,
                                     cost: AnimistForce.A.cost (x),
                                     costShort: AnimistForce.A.costShort (x),
                                     costNoMod: false,
                                     range: ndash,
                                     rangeShort: ndash,
                                     rangeNoMod: false,
                                     duration: AnimistForce.A.duration (x),
                                     durationShort: AnimistForce.A.durationShort (x),
                                     durationNoMod: false,
                                     target: ndash,
                                     src: AnimistForce.A.src (x),
                                     errata: AnimistForce.A.errata (x),
                                     category: Nothing,
                                   })
