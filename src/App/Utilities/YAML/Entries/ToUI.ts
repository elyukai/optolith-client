/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { L10n, L10nRecord } from "../../../Models/Wiki/L10n"
import { pipe } from "../../pipe"
import { YamlNameMap } from "../SchemaMap"

export const toUI : (locale : string) => (yaml_mp : YamlNameMap) => L10nRecord
                  = locale => pipe (
                      yaml_mp => yaml_mp.UIL10nOverride === undefined
                                 ? yaml_mp.UIL10nDefault
                                 : yaml_mp.UIL10nOverride,
                      l10n => L10n ({
                        id: locale,
                        ...l10n,
                      })
                    )
