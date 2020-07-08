import { List } from "../../../Data/List"
import { MagicalGroup, MagicalTradition } from "../../Constants/Groups"
import { ndash } from "../../Utilities/Chars"
import { DominationRitual } from "../DominationRitual.gen"
import { Spell } from "./Spell"

export { DominationRitual }

export const dominationRitualToSpell = (x: DominationRitual): Spell => ({
                                         id: x.id,
                                         name: x.name,
                                         check: x.check,
                                         checkMod: x.checkMod,
                                         gr: MagicalGroup.DominationRituals,
                                         ic: "B",
                                         property: x.property,
                                         traditions: List (MagicalTradition.Druids),
                                         effect: x.effect,
                                         castingTime: ndash,
                                         castingTimeShort: ndash,
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
