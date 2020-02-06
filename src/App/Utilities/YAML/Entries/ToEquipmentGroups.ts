/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { EquipmentGroupL10n } from "../Schema/EquipmentGroups/EquipmentGroups.l10n"
import { YamlFileConverter } from "../ToRecordsByFile"


const toEquipmentGroup : (x : EquipmentGroupL10n) => [number, Record<NumIdName>]
                       = x => [ x.id, NumIdName (x) ]


export const toEquipmentGroups : YamlFileConverter<number, Record<NumIdName>>
                                    = pipe (
                                        yaml_mp => yaml_mp.EquipmentGroupsL10n,
                                        map (toEquipmentGroup),
                                        toMapIntegrity,
                                        second (fromMap)
                                      )
