/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { EyeColorL10n } from "../../../../../app/Database/Schema/EyeColors/EyeColors.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toEyeColor : (x : EyeColorL10n) => [number, Record<NumIdName>]
                 = x => [ x.id, NumIdName (x) ]


export const toEyeColors : YamlFileConverter<number, Record<NumIdName>>
                         = pipe (
                             yaml_mp => mergeBy ("id")
                                                (yaml_mp.EyeColorsL10nDefault)
                                                (yaml_mp.EyeColorsL10nOverride),
                             map (toEyeColor),
                             toMapIntegrity,
                             second (fromMap)
                           )
