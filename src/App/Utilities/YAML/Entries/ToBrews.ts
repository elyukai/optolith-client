/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { BrewL10n } from "../../../../../app/Database/Schema/Brews/Brews.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toBrew : (x : BrewL10n) => [number, Record<NumIdName>]
             = x => [ x.id, NumIdName (x) ]


export const toBrews : YamlFileConverter<number, Record<NumIdName>>
                                    = pipe (
                                        yaml_mp => mergeBy ("id")
                                                           (yaml_mp.BrewsL10nDefault)
                                                           (yaml_mp.BrewsL10nOverride),
                                        map (toBrew),
                                        toMapIntegrity,
                                        second (fromMap)
                                      )
