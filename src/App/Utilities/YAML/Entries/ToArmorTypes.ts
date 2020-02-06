/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { ArmorTypeL10n } from "../Schema/ArmorTypes/ArmorTypes.l10n"
import { YamlFileConverter } from "../ToRecordsByFile"


const toArmorType : (x : ArmorTypeL10n) => [number, Record<NumIdName>]
                  = x => [ x.id, NumIdName (x) ]


export const toArmorTypes : YamlFileConverter<number, Record<NumIdName>>
                          = pipe (
                              yaml_mp => yaml_mp.ArmorTypesL10n,
                              map (toArmorType),
                              toMapIntegrity,
                              second (fromMap)
                            )
