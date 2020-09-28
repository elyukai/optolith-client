/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { SpecialAbilityGroupL10n } from "../../../../../app/Database/Schema/SpecialAbilityGroups/SpecialAbilityGroups.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


const toSpecialAbilityGroup : (x : SpecialAbilityGroupL10n) => [number, Record<NumIdName>]
                            = x => [ x.id, NumIdName (x) ]


export const toSpecialAbilityGroups : YamlFileConverter<number, Record<NumIdName>>
                                    = pipe (
                                        yaml_mp =>
                                          mergeBy ("id")
                                                  (yaml_mp.SpecialAbilityGroupsL10nDefault)
                                                  (yaml_mp.SpecialAbilityGroupsL10nOverride),
                                        map (toSpecialAbilityGroup),
                                        toMapIntegrity,
                                        second (fromMap)
                                      )
