/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { TribeL10n } from "../../../../../app/Database/Schema/Tribes/Tribes.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toTribe : (x : TribeL10n) => [number, Record<NumIdName>]
              = x => [ x.id, NumIdName (x) ]


export const toTribes : YamlFileConverter<number, Record<NumIdName>>
                      = pipe (
                          yaml_mp => mergeBy ("id")
                                             (yaml_mp.TribesL10nDefault)
                                             (yaml_mp.TribesL10nOverride),
                          map (toTribe),
                          toMapIntegrity,
                          second (fromMap)
                        )
