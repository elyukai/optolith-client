import { List } from "../../../Data/List"
import { MagicalGroup, MagicalTradition } from "../../Constants/Groups"
import { ZibiljaRitual } from "../Static_ZibiljaRitual.gen"
import { Spell } from "./Spell"

export { ZibiljaRitual }

export const zibiljaRitualToSpell = (x: ZibiljaRitual): Spell => ({
                                      id: x.id,
                                      name: x.name,
                                      check: x.check,
                                      checkMod: x.checkMod,
                                      gr: MagicalGroup.ZibiljaRituals,
                                      ic: x.ic,
                                      property: x.property,
                                      traditions: List (MagicalTradition.Zibilija),
                                      effect: x.effect,
                                      castingTime: x.ritualTime,
                                      castingTimeShort: x.ritualTimeShort,
                                      castingTimeNoMod: x.ritualTimeNoMod,
                                      aeCost: x.aeCost,
                                      aeCostShort: x.aeCostShort,
                                      aeCostNoMod: x.aeCostNoMod,
                                      range: x.range,
                                      rangeShort: x.rangeShort,
                                      rangeNoMod: x.rangeNoMod,
                                      duration: x.duration,
                                      durationShort: x.durationShort,
                                      durationNoMod: x.durationNoMod,
                                      target: x.target,
                                      src: x.src,
                                      errata: x.errata,
                                    })
