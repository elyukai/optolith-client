/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { ArcaneDancerTraditionL10n } from "../Schema/ArcaneDancerTraditions/ArcaneDancerTraditions.l10n"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toArcaneDancerTradition : (x : ArcaneDancerTraditionL10n) => [number, Record<NumIdName>]
                              = x => [ x.id, NumIdName (x) ]


export const toArcaneDancerTraditions : YamlFileConverter<number, Record<NumIdName>>
                                      = pipe (
                                          yaml_mp =>
                                            mergeBy ("id")
                                                    (yaml_mp.ArcaneDancerTraditionsL10nDefault)
                                                    (yaml_mp.ArcaneDancerTraditionsL10nOverride),
                                          map (toArcaneDancerTradition),
                                          toMapIntegrity,
                                          second (fromMap)
                                        )
