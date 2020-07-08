import { List } from "../../../Data/List"
import { MagicalGroup, MagicalTradition } from "../../Constants/Groups"
import { GeodeRitual } from "../GeodeRitual.gen"
import { Spell } from "./Spell"

export { GeodeRitual }

export const geodeRitualToSpell = (x: GeodeRitual): Spell => ({
                                    id: x.id,
                                    name: x.name,
                                    check: x.check,
                                    checkMod: x.checkMod,
                                    gr: MagicalGroup.GeodeRituals,
                                    ic: "B",
                                    property: x.property,
                                    traditions: List (MagicalTradition.Geodes),
                                    activatablePrerequisites: x.activatablePrerequisites,
                                    effect: x.effect,
                                    castingTime: x.ritualTime,
                                    castingTimeShort: x.ritualTimeShort,
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
