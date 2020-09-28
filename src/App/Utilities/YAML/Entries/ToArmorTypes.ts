/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ArmorTypeL10n } from "../../../../../app/Database/Schema/ArmorTypes/ArmorTypes.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toArmorType : (x : ArmorTypeL10n) => [number, Record<NumIdName>]
                  = x => [ x.id, NumIdName (x) ]


export const toArmorTypes : YamlFileConverter<number, Record<NumIdName>>
                          = pipe (
                              yaml_mp => mergeBy ("id")
                                                 (yaml_mp.ArmorTypesL10nDefault)
                                                 (yaml_mp.ArmorTypesL10nOverride),
                              map (toArmorType),
                              toMapIntegrity,
                              second (fromMap)
                            )
