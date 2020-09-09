/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { CombatSpecialAbilityGroupL10n } from "../../../../../app/Database/Schema/CombatSpecialAbilityGroups/CombatSpecialAbilityGroups.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toCombatSAGroup : (x : CombatSpecialAbilityGroupL10n) => [number, Record<NumIdName>]
                      = x => [ x.id, NumIdName (x) ]


export const toCombatSpecialAbilityGroups : YamlFileConverter<number, Record<NumIdName>>
                                    = pipe (
                                        yaml_mp =>
                                          mergeBy ("id")
                                                  (yaml_mp.CombatSpecialAbilityGroupsL10nDefault)
                                                  (yaml_mp.CombatSpecialAbilityGroupsL10nOverride),
                                        map (toCombatSAGroup),
                                        toMapIntegrity,
                                        second (fromMap)
                                      )
