/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ReachL10n } from "../../../../../app/Database/Schema/Reaches/Reaches.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toReach : (x : ReachL10n) => [number, Record<NumIdName>]
              = x => [ x.id, NumIdName (x) ]


export const toReaches : YamlFileConverter<number, Record<NumIdName>>
                       = pipe (
                           yaml_mp => mergeBy ("id")
                                              (yaml_mp.ReachesL10nDefault)
                                              (yaml_mp.ReachesL10nOverride),
                           map (toReach),
                           toMapIntegrity,
                           second (fromMap)
                         )
