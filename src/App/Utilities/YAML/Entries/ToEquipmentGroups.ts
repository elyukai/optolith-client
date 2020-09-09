/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { EquipmentGroupL10n } from "../../../../../app/Database/Schema/EquipmentGroups/EquipmentGroups.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toEquipmentGroup : (x : EquipmentGroupL10n) => [number, Record<NumIdName>]
                       = x => [ x.id, NumIdName (x) ]


export const toEquipmentGroups : YamlFileConverter<number, Record<NumIdName>>
                                    = pipe (
                                        yaml_mp => mergeBy ("id")
                                                           (yaml_mp.EquipmentGroupsL10nDefault)
                                                           (yaml_mp.EquipmentGroupsL10nOverride),
                                        map (toEquipmentGroup),
                                        toMapIntegrity,
                                        second (fromMap)
                                      )
