/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { StateL10n } from "../../../../../app/Database/Schema/States/States.l10n"
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { State } from "../../../Models/Wiki/State"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toSourceRefs } from "./ToSourceRefs"


const toState : (l10n : StateL10n) => [string, Record<State>]
              = l10n => [
                  l10n.id,
                  State ({
                    id: l10n.id,
                    name: l10n.name,
                    description: l10n.description,
                    src: toSourceRefs (l10n.src),
                    errata: toErrata (l10n.errata),
                  }),
                ]


export const toStates : YamlFileConverter<string, Record<State>>
                      = pipe (
                          yaml_mp => mergeBy ("id")
                                             (yaml_mp.StatesL10nDefault)
                                             (yaml_mp.StatesL10nOverride),
                          map (toState),
                          toMapIntegrity,
                          second (fromMap)
                        )
