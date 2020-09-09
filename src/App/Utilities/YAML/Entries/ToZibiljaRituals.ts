/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ZibiljaRitualL10n } from "../../../../../app/Database/Schema/ZibiljaRituals/ZibiljaRituals.l10n"
import { ZibiljaRitualUniv } from "../../../../../app/Database/Schema/ZibiljaRituals/ZibiljaRituals.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { Maybe } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Tuple } from "../../../../Data/Tuple"
import { ZibiljaRitual as ZR } from "../../../Models/Wiki/ZibiljaRitual"
import { ndash } from "../../Chars"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./ToSourceRefs"


const toZibiljaRitual : YamlPairConverterE<ZibiljaRitualUniv, ZibiljaRitualL10n, string, ZR>
                      = ([ univ, l10n ]) => Right<[string, Record<ZR>]> ([
                          univ.id,
                          ZR ({
                            id: univ .id,
                            name: l10n.name,
                            check: Tuple (univ.check1, univ.check2, univ.check3),
                            checkmod: Maybe (univ.checkMod),
                            ic: univ .ic,
                            property: univ.property,
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
                          }),
                        ])


export const toZibiljaRituals : YamlFileConverter<string, Record<ZR>>
                              = pipe (
                                  (yaml_mp : YamlNameMap) =>
                                    zipBy ("id")
                                          (yaml_mp.ZibiljaRitualsUniv)
                                          (yaml_mp.ZibiljaRitualsL10nDefault)
                                          (yaml_mp.ZibiljaRitualsL10nOverride),
                                  bindF (pipe (
                                    mapM (toZibiljaRitual),
                                    bindF (toMapIntegrity),
                                  )),
                                  second (fromMap)
                                )
