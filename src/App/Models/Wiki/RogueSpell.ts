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

export interface RogueSpell {
  "@@name": "RogueSpell"
  id: string
  name: string
  check: Tuple<[string, string, string]>
  checkmod: Maybe<CheckModifier>
  ic: IC
  property: Property
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

export const RogueSpell =
  fromDefault ("RogueSpell")
              <RogueSpell> ({
                id: "",
                name: "",
                check: Tuple ("", "", ""),
                checkmod: Nothing,
                ic: "A",
                property: 0,
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

export const rogueSpellToSpell = (x: Record<RogueSpell>): Record<Spell> => Spell ({
                                   id: RogueSpell.A.id (x),
                                   name: RogueSpell.A.name (x),
                                   check: List (
                                     sel1 (RogueSpell.A.check (x)),
                                     sel2 (RogueSpell.A.check (x)),
                                     sel3 (RogueSpell.A.check (x)),
                                   ),
                                   checkmod: RogueSpell.A.checkmod (x),
                                   gr: MagicalGroup.RogueSpells,
                                   ic: icToJs (RogueSpell.A.ic (x)),
                                   property: RogueSpell.A.property (x),
                                   tradition: List (MagicalTradition.Rogues),
                                   subtradition: List (),
                                   prerequisites: List (),
                                   effect: RogueSpell.A.effect (x),
                                   castingTime: RogueSpell.A.castingTime (x),
                                   castingTimeShort: RogueSpell.A.castingTimeShort (x),
                                   castingTimeNoMod: false,
                                   cost: RogueSpell.A.cost (x),
                                   costShort: RogueSpell.A.costShort (x),
                                   costNoMod: false,
                                   range: RogueSpell.A.range (x),
                                   rangeShort: RogueSpell.A.rangeShort (x),
                                   rangeNoMod: false,
                                   duration: RogueSpell.A.duration (x),
                                   durationShort: RogueSpell.A.durationShort (x),
                                   durationNoMod: false,
                                   target: RogueSpell.A.target (x),
                                   src: RogueSpell.A.src (x),
                                   errata: RogueSpell.A.errata (x),
                                   category: Nothing,
                                 })
