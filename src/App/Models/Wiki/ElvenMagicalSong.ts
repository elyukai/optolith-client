import { fmap } from "../../../Data/Functor"
import { intercalate, List } from "../../../Data/List"
import { mapMaybe, Maybe, Nothing } from "../../../Data/Maybe"
import { lookupF } from "../../../Data/OrderedMap"
import { fromDefault, Record } from "../../../Data/Record"
import { Tuple } from "../../../Data/Tuple"
import { sel1, sel2, sel3 } from "../../../Data/Tuple/All"
import { icToJs, MagicalGroup, MagicalTradition, Property } from "../../Constants/Groups"
import { ndash } from "../../Utilities/Chars"
import { localizeOrList } from "../../Utilities/I18n"
import { t as IC } from "../../Utilities/IC.gen"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { sortStrings } from "../../Utilities/sortBy"
import { Skill } from "./Skill"
import { Spell } from "./Spell"
import { Erratum } from "./sub/Errata"
import { SourceLink } from "./sub/SourceLink"
import { StaticData, StaticDataRecord } from "./WikiModel"
import { CheckModifier } from "./wikiTypeHelpers"

export interface ElvenMagicalSong {
  "@@name": "ElvenMagicalSong"
  id: string
  name: string
  check: Tuple<[string, string, string]>
  checkmod: Maybe<CheckModifier>

  /**
   * Does enhancing the song only work with one specific skill?
   */
  skill: List<"TAL_9" | "TAL_56">
  ic: IC
  property: Property
  effect: string
  cost: string
  costShort: string
  src: List<Record<SourceLink>>
  errata: List<Record<Erratum>>
}

export const ElvenMagicalSong =
  fromDefault ("ElvenMagicalSong")
              <ElvenMagicalSong> ({
                id: "",
                name: "",
                check: Tuple ("", "", ""),
                checkmod: Nothing,
                skill: List (),
                ic: "A",
                property: 0,
                effect: "",
                cost: "",
                costShort: "",
                src: List.empty,
                errata: List (),
              })

const getApplicableSkills = (staticData: StaticDataRecord) =>
                              pipe (
                                ElvenMagicalSong.A.skill,
                                mapMaybe (pipe (
                                  lookupF (StaticData.A.skills (staticData)),
                                  fmap (Skill.A.name)
                                )),
                                sortStrings (staticData)
                              )

export const elvenMagicalSongToSpell = (staticData: StaticDataRecord) =>
                                       (x: Record<ElvenMagicalSong>): Record<Spell> => Spell ({
                                         id: ElvenMagicalSong.A.id (x),
                                         name: ElvenMagicalSong.A.name (x),
                                         check: List (
                                           sel1 (ElvenMagicalSong.A.check (x)),
                                           sel2 (ElvenMagicalSong.A.check (x)),
                                           sel3 (ElvenMagicalSong.A.check (x)),
                                         ),
                                         checkmod: ElvenMagicalSong.A.checkmod (x),
                                         gr: MagicalGroup.ElvenMagicalSongs,
                                         ic: icToJs (ElvenMagicalSong.A.ic (x)),
                                         property: ElvenMagicalSong.A.property (x),
                                         tradition: List (MagicalTradition.Elves),
                                         subtradition: List (),
                                         prerequisites: List (),
                                         effect: ElvenMagicalSong.A.effect (x),
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
                                         cost: ElvenMagicalSong.A.cost (x),
                                         costShort: ElvenMagicalSong.A.costShort (x),
                                         costNoMod: false,
                                         range: ndash,
                                         rangeShort: ndash,
                                         rangeNoMod: false,
                                         duration: ndash,
                                         durationShort: ndash,
                                         durationNoMod: false,
                                         target: ndash,
                                         src: ElvenMagicalSong.A.src (x),
                                         errata: ElvenMagicalSong.A.errata (x),
                                         category: Nothing,
                                       })
