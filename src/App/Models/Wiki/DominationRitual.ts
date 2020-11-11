import { List } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { sel1, sel2, sel3 } from "../../../Data/Tuple/All"
import { IC, MagicalGroup, MagicalTradition, Property } from "../../Constants/Groups"
import { ndash } from "../../Utilities/Chars"
import { Spell } from "./Spell"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"
import { CheckModifier } from "./wikiTypeHelpers"

export const DominationRitualIC = IC.B

export interface DominationRitual {
  "@@name": "DominationRitual"
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
export const DominationRitual =
  fromDefault ("DominationRitual")
              <DominationRitual> ({
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

export const dominationRitualToSpell = (x: Record<DominationRitual>): Record<Spell> => Spell ({
                                         id: DominationRitual.A.id (x),
                                         name: DominationRitual.A.name (x),
                                         check: List (
                                           sel1 (DominationRitual.A.check (x)),
                                           sel2 (DominationRitual.A.check (x)),
                                           sel3 (DominationRitual.A.check (x)),
                                         ),
                                         checkmod: DominationRitual.A.checkmod (x),
                                         gr: MagicalGroup.DominationRituals,
                                         ic: DominationRitualIC,
                                         property: DominationRitual.A.property (x),
                                         tradition: List (MagicalTradition.Druids),
                                         subtradition: List (),
                                         prerequisites: List (),
                                         effect: DominationRitual.A.effect (x),
                                         castingTime: ndash,
                                         castingTimeShort: ndash,
                                         castingTimeNoMod: false,
                                         cost: DominationRitual.A.cost (x),
                                         costShort: DominationRitual.A.costShort (x),
                                         costNoMod: false,
                                         range: ndash,
                                         rangeShort: ndash,
                                         rangeNoMod: false,
                                         duration: DominationRitual.A.duration (x),
                                         durationShort: DominationRitual.A.durationShort (x),
                                         durationNoMod: false,
                                         target: ndash,
                                         src: DominationRitual.A.src (x),
                                         errata: DominationRitual.A.errata (x),
                                         category: Nothing,
                                       })
