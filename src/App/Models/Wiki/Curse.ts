import { List } from "../../../Data/List"
import { IC, MagicalGroup, MagicalTradition } from "../../Constants/Groups"
import { ndash } from "../../Utilities/Chars"
import { Curse } from "../Static_Curse.gen"
import { Spell } from "./Spell"

export const CurseIC = IC.B

export { Curse }

export const curseToSpell = (x: Curse): Spell => ({
                              id: x.id,
                              name: x.name,
                              check: x.check,
                              checkMod: x.checkMod,
                              gr: MagicalGroup.Curses,
                              ic: "B",
                              property: x.property,
                              traditions: List (MagicalTradition.Witches),
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
