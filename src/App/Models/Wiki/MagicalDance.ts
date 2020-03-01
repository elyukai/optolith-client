import { List } from "../../../Data/List"
import { Nothing } from "../../../Data/Maybe"
import { OrderedMap } from "../../../Data/OrderedMap"
import { fromDefault, Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { sel1, sel2, sel3 } from "../../../Data/Tuple/All"
import { icToJs, MagicalGroup, MagicalTradition, Property } from "../../Constants/Groups"
import { ndash } from "../../Utilities/Chars"
import { t as IC } from "../../Utilities/IC.gen"
import { NumIdName } from "../NumIdName"
import { Spell } from "./Spell"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"

export interface MagicalDance {
  "@@name": "MagicalDance"
  id: string
  name: string
  nameByTradition: OrderedMap<number, Record<NumIdName>>
  check: Tuple<[string, string, string]>
  ic: IC
  property: Property
  musictraditions: List<number>
  effect: string
  duration: string
  durationShort: string
  cost: string
  costShort: string
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

export const MagicalDance =
  fromDefault ("MagicalDance")
              <MagicalDance> ({
                id: "",
                name: "",
                nameByTradition: OrderedMap.empty,
                check: Tuple ("", "", ""),
                ic: "A",
                property: 0,
                musictraditions: List.empty,
                effect: "",
                cost: "",
                costShort: "",
                duration: "",
                durationShort: "",
                src: List.empty,
                errata: List (),
              })

export const magicalDanceToSpell = (x: Record<MagicalDance>): Record<Spell> => Spell ({
                                     id: MagicalDance.A.id (x),
                                     name: MagicalDance.A.name (x),
                                     check: List (
                                       sel1 (MagicalDance.A.check (x)),
                                       sel2 (MagicalDance.A.check (x)),
                                       sel3 (MagicalDance.A.check (x)),
                                     ),
                                     checkmod: Nothing,
                                     gr: MagicalGroup.MagicalDances,
                                     ic: icToJs (MagicalDance.A.ic (x)),
                                     property: MagicalDance.A.property (x),
                                     tradition: List (MagicalTradition.ArcaneDancers),
                                     subtradition: MagicalDance.A.musictraditions (x),
                                     prerequisites: List (),
                                     effect: MagicalDance.A.effect (x),
                                     castingTime: ndash,
                                     castingTimeShort: ndash,
                                     castingTimeNoMod: false,
                                     cost: MagicalDance.A.cost (x),
                                     costShort: MagicalDance.A.costShort (x),
                                     costNoMod: false,
                                     range: ndash,
                                     rangeShort: ndash,
                                     rangeNoMod: false,
                                     duration: MagicalDance.A.duration (x),
                                     durationShort: MagicalDance.A.durationShort (x),
                                     durationNoMod: false,
                                     target: ndash,
                                     src: MagicalDance.A.src (x),
                                     errata: MagicalDance.A.errata (x),
                                     category: Nothing,
                                   })
