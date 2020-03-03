/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { bindF, Right, second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { FocusRule } from "../../../Models/Wiki/FocusRule"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { FocusRuleL10n } from "../Schema/FocusRules/FocusRules.l10n"
import { FocusRuleUniv } from "../Schema/FocusRules/FocusRules.univ"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toSourceRefs } from "./ToSourceRefs"


const toFocusRule : YamlPairConverterE<FocusRuleUniv, FocusRuleL10n, string, FocusRule>
                  = ([ univ, l10n ]) => Right<[string, Record<FocusRule>]> ([
                      univ.id,
                      FocusRule ({
                        id: univ.id,
                        name: l10n.name,
                        level: univ.level,
                        subject: univ.subject,
                        description: l10n.description,
                        src: toSourceRefs (l10n.src),
                        errata: toErrata (l10n.errata),
                      }),
                    ])


export const toFocusRules : YamlFileConverter<string, Record<FocusRule>>
                          = pipe (
                              (yaml_mp : YamlNameMap) =>
                                zipBy ("id")
                                      (yaml_mp.FocusRulesUniv)
                                      (yaml_mp.FocusRulesL10n),
                              bindF (pipe (
                                mapM (toFocusRule),
                                bindF (toMapIntegrity),
                              )),
                              second (fromMap)
                            )
