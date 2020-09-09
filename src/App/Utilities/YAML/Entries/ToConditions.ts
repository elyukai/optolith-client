/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ConditionL10n } from "../../../../../app/Database/Schema/Conditions/Conditions.l10n"
import { second } from "../../../../Data/Either"
import { Maybe } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Tuple } from "../../../../Data/Tuple"
import { Condition } from "../../../Models/Wiki/Condition"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toSourceRefs } from "./ToSourceRefs"


const toCondition : (l10n : ConditionL10n) => [string, Record<Condition>]
                  = l10n => [
                      l10n.id,
                      Condition ({
                        id: l10n.id,
                        name: l10n.name,
                        description: Maybe (l10n.description),
                        levelColumnDescription: Maybe (l10n.levelDescription),
                        levelDescriptions: Tuple (
                          l10n.level1,
                          l10n.level2,
                          l10n.level3,
                          l10n.level4,
                        ),
                        src: toSourceRefs (l10n.src),
                        errata: toErrata (l10n.errata),
                      }),
                    ]


export const toConditions : YamlFileConverter<string, Record<Condition>>
                          = pipe (
                              yaml_mp => mergeBy ("id")
                                                 (yaml_mp.ConditionsL10nDefault)
                                                 (yaml_mp.ConditionsL10nOverride),
                              map (toCondition),
                              toMapIntegrity,
                              second (fromMap)
                            )
