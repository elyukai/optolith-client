import { lookupF } from "../../../Data/IntMap"
import { intercalate, List } from "../../../Data/List"
import { fmap, mapMaybe, maybe } from "../../../Data/Maybe"
import { MagicalGroup, MagicalTradition } from "../../Constants/Groups"
import { skillToInt } from "../../Constants/Id.gen"
import { ndash } from "../../Utilities/Chars"
import { localizeOrList } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { sortStrings } from "../../Utilities/sortBy"
import { MagicalMelody } from "../MagicalMelody.gen"
import { Spell } from "./Spell"
import { StaticData } from "./WikiModel"

export { MagicalMelody }

const getApplicableSkills = (staticData: StaticData) =>
                              pipe (
                                (x: MagicalMelody) => x.skill,
                                maybe (List (skillToInt ("Singing"), skillToInt ("Music")))
                                      (x => List (x)),
                                mapMaybe (pipe (
                                  lookupF (staticData.skills),
                                  fmap (x => x.name)
                                )),
                                sortStrings (staticData)
                              )

export const magicalMelodyToSpell = (staticData: StaticData) =>
                                    (x: MagicalMelody): Spell => ({
                                      id: x.id,
                                      name: x.name,
                                      check: x.check,
                                      gr: MagicalGroup.MagicalMelodies,
                                      ic: x.ic,
                                      property: x.property,
                                      traditions: List (MagicalTradition.ArcaneBards),
                                      effect: x.effect,
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
                                      aeCost: x.aeCost,
                                      aeCostShort: x.aeCostShort,
                                      aeCostNoMod: false,
                                      range: ndash,
                                      rangeShort: ndash,
                                      rangeNoMod: false,
                                      duration: x.duration,
                                      durationShort: x.durationShort,
                                      durationNoMod: false,
                                      target: ndash,
                                      src: x.src,
                                      errata: x.errata,
                                    })
