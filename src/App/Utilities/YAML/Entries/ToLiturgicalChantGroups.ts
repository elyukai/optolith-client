/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { LiturgicalChantGroupL10n } from "../Schema/LiturgicalChantGroups/LiturgicalChantGroups.l10n"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toLiturgicalChantGroup : (x : LiturgicalChantGroupL10n) => [number, Record<NumIdName>]
                             = x => [ x.id, NumIdName (x) ]


export const toLiturgicalChantGroups : YamlFileConverter<number, Record<NumIdName>>
                                    = pipe (
                                        yaml_mp => mergeBy("id")
                                                          (yaml_mp.LiturgicalChantGroupsDefault)
                                                          (yaml_mp.LiturgicalChantGroupsL10n),
                                        map (toLiturgicalChantGroup),
                                        toMapIntegrity,
                                        second (fromMap)
                                      )
