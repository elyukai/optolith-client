/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { CombatTechniqueGroupL10n } from "../Schema/CombatTechniqueGroups/CombatTechniqueGroups.l10n"
import { YamlFileConverter } from "../ToRecordsByFile"


const toCombatTechniqueGroup : (x : CombatTechniqueGroupL10n) => [number, Record<NumIdName>]
                             = x => [ x.id, NumIdName (x) ]


export const toCombatTechniqueGroups : YamlFileConverter<number, Record<NumIdName>>
                                    = pipe (
                                        yaml_mp => yaml_mp.CombatTechniqueGroupsL10n,
                                        map (toCombatTechniqueGroup),
                                        toMapIntegrity,
                                        second (fromMap)
                                      )
