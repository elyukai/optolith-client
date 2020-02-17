/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { ArcaneBardTraditionL10n } from "../Schema/ArcaneBardTraditions/ArcaneBardTraditions.l10n"
import { YamlFileConverter } from "../ToRecordsByFile"


const toArcaneBardTradition : (x : ArcaneBardTraditionL10n) => [number, Record<NumIdName>]
                            = x => [ x.id, NumIdName (x) ]


export const toArcaneBardTraditions : YamlFileConverter<number, Record<NumIdName>>
                                    = pipe (
                                        yaml_mp => yaml_mp.ArcaneBardTraditionsL10n,
                                        map (toArcaneBardTradition),
                                        toMapIntegrity,
                                        second (fromMap)
                                      )
