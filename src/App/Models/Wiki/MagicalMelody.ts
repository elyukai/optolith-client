import { fmap } from "../../../Data/Functor"
import { intercalate, List } from "../../../Data/List"
import { mapMaybe, Nothing } from "../../../Data/Maybe"
import { lookupF, OrderedMap } from "../../../Data/OrderedMap"
import { fromDefault, Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { sel1, sel2, sel3 } from "../../../Data/Tuple/All"
import { MagicalGroup, MagicalTradition, Property } from "../../Constants/Groups"
import { ndash } from "../../Utilities/Chars"
import { localizeOrList } from "../../Utilities/I18n"
import { ImprovementCost } from "../../Utilities/ImprovementCost"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { sortStrings } from "../../Utilities/sortBy"
import { NumIdName } from "../NumIdName"
import { Skill } from "./Skill"
import { Spell } from "./Spell"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"
import { StaticData, StaticDataRecord } from "./WikiModel"

export interface MagicalMelody {
  "@@name": "MagicalMelody"
  id: string
  name: string
  nameByTradition: OrderedMap<number, Record<NumIdName>>
  check: Tuple<[string, string, string]>

  /**
   * Does enhancing the song only work with one specific skill?
   */
  skill: List<"TAL_9" | "TAL_56">
  ic: ImprovementCost
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

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MagicalMelody =
  fromDefault ("MagicalMelody")
              <MagicalMelody> ({
                id: "",
                name: "",
                nameByTradition: OrderedMap.empty,
                check: Tuple ("", "", ""),
                skill: List (),
                ic: ImprovementCost.A,
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

const getApplicableSkills = (staticData: StaticDataRecord) =>
                              pipe (
                                MagicalMelody.A.skill,
                                mapMaybe (pipe (
                                  lookupF (StaticData.A.skills (staticData)),
                                  fmap (Skill.A.name)
                                )),
                                sortStrings (staticData)
                              )

export const magicalMelodyToSpell = (staticData: StaticDataRecord) =>
                                    (x: Record<MagicalMelody>): Record<Spell> => Spell ({
                                      id: MagicalMelody.A.id (x),
                                      name: MagicalMelody.A.name (x),
                                      check: List (
                                        sel1 (MagicalMelody.A.check (x)),
                                        sel2 (MagicalMelody.A.check (x)),
                                        sel3 (MagicalMelody.A.check (x)),
                                      ),
                                      checkmod: Nothing,
                                      gr: MagicalGroup.MagicalMelodies,
                                      ic: MagicalMelody.A.ic (x),
                                      property: MagicalMelody.A.property (x),
                                      tradition: List (MagicalTradition.ArcaneBards),
                                      subtradition: MagicalMelody.A.musictraditions (x),
                                      prerequisites: List (),
                                      effect: MagicalMelody.A.effect (x),
                                      castingTime: pipe_ (
                                        x,
                                        getApplicableSkills (staticData),
                                        localizeOrList (staticData)
                                      ),
                                      castingTimeShort: pipe_ (
                                        x,
                                        getApplicableSkills (staticData),
                                        intercalate ("/")
                                      ),
                                      castingTimeNoMod: false,
                                      cost: MagicalMelody.A.cost (x),
                                      costShort: MagicalMelody.A.costShort (x),
                                      costNoMod: false,
                                      range: ndash,
                                      rangeShort: ndash,
                                      rangeNoMod: false,
                                      duration: MagicalMelody.A.duration (x),
                                      durationShort: MagicalMelody.A.durationShort (x),
                                      durationNoMod: false,
                                      target: ndash,
                                      src: MagicalMelody.A.src (x),
                                      errata: MagicalMelody.A.errata (x),
                                      category: Nothing,
                                    })
