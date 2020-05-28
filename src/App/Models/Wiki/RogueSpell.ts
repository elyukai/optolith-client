import { List } from "../../../Data/List"
import { MagicalGroup, MagicalTradition } from "../../Constants/Groups"
import { RogueSpell } from "../Static_RogueSpell.gen"
import { Spell } from "./Spell"

export { RogueSpell }

export const rogueSpellToSpell = (x: RogueSpell): Spell => ({
                                   id: x.id,
                                   name: x.name,
                                   check: x.check,
                                   checkMod: x.checkMod,
                                   gr: MagicalGroup.RogueSpells,
                                   ic: x.ic,
                                   property: x.property,
                                   traditions: List (MagicalTradition.Rogues),
                                   effect: x.effect,
                                   castingTime: x.castingTime,
                                   castingTimeShort: x.castingTimeShort,
                                   castingTimeNoMod: false,
                                   aeCost: x.aeCost,
                                   aeCostShort: x.aeCostShort,
                                   aeCostNoMod: false,
                                   range: x.range,
                                   rangeShort: x.rangeShort,
                                   rangeNoMod: false,
                                   duration: x.duration,
                                   durationShort: x.durationShort,
                                   durationNoMod: false,
                                   target: x.target,
                                   src: x.src,
                                   errata: x.errata,
                                 })
