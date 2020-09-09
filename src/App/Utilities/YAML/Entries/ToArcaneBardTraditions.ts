/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ArcaneBardTraditionL10n } from "../../../../../app/Database/Schema/ArcaneBardTraditions/ArcaneBardTraditions.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toArcaneBardTradition : (x : ArcaneBardTraditionL10n) => [number, Record<NumIdName>]
                            = x => [ x.id, NumIdName (x) ]


export const toArcaneBardTraditions : YamlFileConverter<number, Record<NumIdName>>
                                    = pipe (
                                        yaml_mp => mergeBy ("id")
                                                        (yaml_mp.ArcaneBardTraditionsL10nDefault)
                                                        (yaml_mp.ArcaneBardTraditionsL10nOverride),
                                        map (toArcaneBardTradition),
                                        toMapIntegrity,
                                        second (fromMap)
                                      )
