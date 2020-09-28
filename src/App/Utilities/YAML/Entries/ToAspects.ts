/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { AspectL10n } from "../../../../../app/Database/Schema/Aspects/Aspects.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toAspect : (x : AspectL10n) => [number, Record<NumIdName>]
               = x => [ x.id, NumIdName (x) ]


export const toAspects : YamlFileConverter<number, Record<NumIdName>>
                       = pipe (
                           yaml_mp => mergeBy ("id")
                                              (yaml_mp.AspectsL10nDefault)
                                              (yaml_mp.AspectsL10nOverride),
                           map (toAspect),
                           toMapIntegrity,
                           second (fromMap)
                         )
