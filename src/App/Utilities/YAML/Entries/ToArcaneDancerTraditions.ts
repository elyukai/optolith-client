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


const toArcaneDancerTradition : (x : ArcaneDancerTraditionL10n) => [number, Record<NumIdName>]
                              = x => [
                                  x.id,
                                  NumIdName ({
                                    id: x.id,
                                    name: x.name,
                                  }),
                                ]


export const toArcaneDancerTraditions : YamlFileConverter<number, Record<NumIdName>>
                                      = pipe (
                                          yaml_mp => yaml_mp.ArcaneDancerTraditionsL10n,
                                          map (toArcaneDancerTradition),
                                          toMapIntegrity,
                                          second (fromMap)
                                        )
