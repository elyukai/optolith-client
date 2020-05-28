import { List } from "../../../Data/List"
import { MagicalGroup, MagicalTradition } from "../../Constants/Groups"
import { ndash } from "../../Utilities/Chars"
import { MagicalDance } from "../Static_MagicalDance.gen"
import { Spell } from "./Spell"

export { MagicalDance }

export const magicalDanceToSpell = (x: MagicalDance): Spell => ({
                                     id: x.id,
                                     name: x.name,
                                     check: x.check,
                                     gr: MagicalGroup.MagicalDances,
                                     ic: x.ic,
                                     property: x.property,
                                     traditions: List (MagicalTradition.ArcaneDancers),
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
