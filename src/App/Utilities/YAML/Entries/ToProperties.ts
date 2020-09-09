/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { PropertyL10n } from "../../../../../app/Database/Schema/Properties/Properties.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toProperty : (x : PropertyL10n) => [number, Record<NumIdName>]
                 = x => [ x.id, NumIdName (x) ]


export const toProperties : YamlFileConverter<number, Record<NumIdName>>
                          = pipe (
                              yaml_mp => mergeBy ("id")
                                                 (yaml_mp.PropertiesL10nDefault)
                                                 (yaml_mp.PropertiesL10nOverride),
                              map (toProperty),
                              toMapIntegrity,
                              second (fromMap)
                            )
