/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { bindF, Right, second } from "../../../../Data/Either"
import { List } from "../../../../Data/List"
import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { MagicalGroup, MagicalTradition } from "../../../Constants/Groups"
import { Spell } from "../../../Models/Wiki/Spell"
import { icToInt } from "../../AdventurePoints/improvementCostUtils"
import { ndash } from "../../Chars"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { ZibiljaRitualL10n } from "../Schema/ZibiljaRituals/ZibiljaRituals.l10n"
import { ZibiljaRitualUniv } from "../Schema/ZibiljaRituals/ZibiljaRituals.univ"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./toErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./ToSourceRefs"


const toZibiljaRitual : YamlPairConverterE<ZibiljaRitualUniv, ZibiljaRitualL10n, string, Spell>
                      = ([ univ, l10n ]) => Right<[string, Record<Spell>]> ([
                          univ.id,
                          Spell ({
                            id: univ .id,
                            name: l10n.name,
                            check: List (univ.check1, univ.check2, univ.check3),
                            checkmod: Maybe (univ.checkMod),
                            gr: MagicalGroup.ZibiljaRituals,
                            ic: icToInt (univ .ic),
                            property: univ.property,
                            tradition: List (MagicalTradition.Zibilija),
                            subtradition: List (),
                            prerequisites: List (),
                            effect: toMarkdown (l10n.effect),
                            castingTime: ndash,
                            castingTimeShort: ndash,
                            castingTimeNoMod: univ.castingTimeNoMod,
                            cost: l10n.aeCost,
                            costShort: l10n.aeCostShort,
                            costNoMod: univ.aeCostNoMod,
                            range: l10n.range,
                            rangeShort: l10n.rangeShort,
                            rangeNoMod: univ.rangeNoMod,
                            duration: l10n.duration,
                            durationShort: l10n.durationShort,
                            durationNoMod: univ.durationNoMod,
                            target: l10n.target,
                            src: toSourceRefs (l10n.src),
                            errata: toErrata (l10n.errata),
                            category: Nothing,
                          }),
                        ])


export const toZibiljaRituals : YamlFileConverter<string, Record<Spell>>
                              = pipe (
                                  (yaml_mp : YamlNameMap) => zipBy ("id")
                                                                   (yaml_mp.ZibiljaRitualsUniv)
                                                                   (yaml_mp.ZibiljaRitualsL10n),
                                  bindF (pipe (
                                    mapM (toZibiljaRitual),
                                    bindF (toMapIntegrity),
                                  )),
                                  second (fromMap)
                                )
