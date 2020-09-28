/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { HairColorL10n } from "../../../../../app/Database/Schema/HairColors/HairColors.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toHairColor : (x : HairColorL10n) => [number, Record<NumIdName>]
                  = x => [ x.id, NumIdName (x) ]


export const toHairColors : YamlFileConverter<number, Record<NumIdName>>
                          = pipe (
                              yaml_mp => mergeBy ("id")
                                                 (yaml_mp.HairColorsL10nDefault)
                                                 (yaml_mp.HairColorsL10nOverride),
                              map (toHairColor),
                              toMapIntegrity,
                              second (fromMap)
                            )
