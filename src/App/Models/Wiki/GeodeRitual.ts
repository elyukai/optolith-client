import { List } from "../../../Data/List"
import { Maybe, Nothing } from "../../../Data/Maybe"
import { fromDefault, Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { sel1, sel2, sel3 } from "../../../Data/Tuple/All"
import { IC, MagicalGroup, MagicalTradition, Property } from "../../Constants/Groups"
import { RequireActivatable } from "./prerequisites/ActivatableRequirement"
import { Spell } from "./Spell"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"
import { CheckModifier } from "./wikiTypeHelpers"

export const GeodeRitualIC = IC.B

export interface GeodeRitual {
  "@@name": "GeodeRitual"
  id: string
  name: string
  check: Tuple<[string, string, string]>
  checkmod: Maybe<CheckModifier>
  property: Property
  prerequisites: List<Record<RequireActivatable>>
  effect: string
  castingTime: string
  castingTimeShort: string
  cost: string
  costShort: string
  range: string
  rangeShort: string
  duration: string
  durationShort: string
  target: string
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

export const GeodeRitual =
  fromDefault ("GeodeRitual")
              <GeodeRitual> ({
                id: "",
                name: "",
                check: Tuple ("", "", ""),
                checkmod: Nothing,
                property: 0,
                prerequisites: List.empty,
                effect: "",
                castingTime: "",
                castingTimeShort: "",
                cost: "",
                costShort: "",
                range: "",
                rangeShort: "",
                duration: "",
                durationShort: "",
                target: "",
                src: List.empty,
                errata: List (),
              })

export const geodeRitualToSpell = (x: Record<GeodeRitual>): Record<Spell> => Spell ({
                                    id: GeodeRitual.A.id (x),
                                    name: GeodeRitual.A.name (x),
                                    check: List (
                                      sel1 (GeodeRitual.A.check (x)),
                                      sel2 (GeodeRitual.A.check (x)),
                                      sel3 (GeodeRitual.A.check (x)),
                                    ),
                                    checkmod: GeodeRitual.A.checkmod (x),
                                    gr: MagicalGroup.GeodeRituals,
                                    ic: GeodeRitualIC,
                                    property: GeodeRitual.A.property (x),
                                    tradition: List (MagicalTradition.Geodes),
                                    subtradition: List (),
                                    prerequisites: GeodeRitual.A.prerequisites (x),
                                    effect: GeodeRitual.A.effect (x),
                                    castingTime: GeodeRitual.A.castingTime (x),
                                    castingTimeShort: GeodeRitual.A.castingTimeShort (x),
                                    castingTimeNoMod: false,
                                    cost: GeodeRitual.A.cost (x),
                                    costShort: GeodeRitual.A.costShort (x),
                                    costNoMod: false,
                                    range: GeodeRitual.A.range (x),
                                    rangeShort: GeodeRitual.A.rangeShort (x),
                                    rangeNoMod: false,
                                    duration: GeodeRitual.A.duration (x),
                                    durationShort: GeodeRitual.A.durationShort (x),
                                    durationNoMod: false,
                                    target: GeodeRitual.A.target (x),
                                    src: GeodeRitual.A.src (x),
                                    errata: GeodeRitual.A.errata (x),
                                    category: Nothing,
                                  })
