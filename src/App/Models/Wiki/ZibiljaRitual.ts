import { List } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { sel1, sel2, sel3 } from "../../../Data/Tuple/All"
import { icToJs, MagicalGroup, MagicalTradition, Property } from "../../Constants/Groups"
import { t as IC } from "../../Utilities/IC.gen"
import { Spell } from "./Spell"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"
import { CheckModifier } from "./wikiTypeHelpers"

export interface ZibiljaRitual {
  "@@name": "ZibiljaRitual"
  id: string
  name: string
  check: Tuple<[string, string, string]>
  checkmod: Maybe<CheckModifier>
  ic: IC
  property: Property
  effect: string
  castingTime: string
  castingTimeShort: string
  castingTimeNoMod: boolean
  cost: string
  costShort: string
  costNoMod: boolean
  range: string
  rangeShort: string
  rangeNoMod: boolean
  duration: string
  durationShort: string
  durationNoMod: boolean
  target: string
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ZibiljaRitual =
  fromDefault ("ZibiljaRitual")
              <ZibiljaRitual> ({
                id: "",
                name: "",
                check: Tuple ("", "", ""),
                checkmod: Nothing,
                ic: "A",
                property: 0,
                effect: "",
                castingTime: "",
                castingTimeShort: "",
                castingTimeNoMod: false,
                cost: "",
                costShort: "",
                costNoMod: false,
                range: "",
                rangeShort: "",
                rangeNoMod: false,
                duration: "",
                durationShort: "",
                durationNoMod: false,
                target: "",
                src: List.empty,
                errata: List (),
              })

export const zibiljaRitualToSpell = (x: Record<ZibiljaRitual>): Record<Spell> => Spell ({
                                      id: ZibiljaRitual.A.id (x),
                                      name: ZibiljaRitual.A.name (x),
                                      check: List (
                                        sel1 (ZibiljaRitual.A.check (x)),
                                        sel2 (ZibiljaRitual.A.check (x)),
                                        sel3 (ZibiljaRitual.A.check (x)),
                                      ),
                                      checkmod: ZibiljaRitual.A.checkmod (x),
                                      gr: MagicalGroup.ZibiljaRituals,
                                      ic: icToJs (ZibiljaRitual.A.ic (x)),
                                      property: ZibiljaRitual.A.property (x),
                                      tradition: List (MagicalTradition.Zibilija),
                                      subtradition: List (),
                                      prerequisites: List (),
                                      effect: ZibiljaRitual.A.effect (x),
                                      castingTime: ZibiljaRitual.A.castingTime (x),
                                      castingTimeShort: ZibiljaRitual.A.castingTimeShort (x),
                                      castingTimeNoMod: ZibiljaRitual.A.castingTimeNoMod (x),
                                      cost: ZibiljaRitual.A.cost (x),
                                      costShort: ZibiljaRitual.A.costShort (x),
                                      costNoMod: ZibiljaRitual.A.costNoMod (x),
                                      range: ZibiljaRitual.A.range (x),
                                      rangeShort: ZibiljaRitual.A.rangeShort (x),
                                      rangeNoMod: ZibiljaRitual.A.rangeNoMod (x),
                                      duration: ZibiljaRitual.A.duration (x),
                                      durationShort: ZibiljaRitual.A.durationShort (x),
                                      durationNoMod: ZibiljaRitual.A.durationNoMod (x),
                                      target: ZibiljaRitual.A.target (x),
                                      src: ZibiljaRitual.A.src (x),
                                      errata: ZibiljaRitual.A.errata (x),
                                      category: Nothing,
                                    })
