/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { CombatTechniqueGroupL10n } from "../../../../../app/Database/Schema/CombatTechniqueGroups/CombatTechniqueGroups.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toCombatTechniqueGroup : (x : CombatTechniqueGroupL10n) => [number, Record<NumIdName>]
                             = x => [ x.id, NumIdName (x) ]


export const toCombatTechniqueGroups : YamlFileConverter<number, Record<NumIdName>>
                                    = pipe (
                                        yaml_mp =>
                                          mergeBy ("id")
                                                  (yaml_mp.CombatTechniqueGroupsL10nDefault)
                                                  (yaml_mp.CombatTechniqueGroupsL10nOverride),
                                        map (toCombatTechniqueGroup),
                                        toMapIntegrity,
                                        second (fromMap)
                                      )
