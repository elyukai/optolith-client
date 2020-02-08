/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { second } from "../../../../Data/Either"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { State } from "../../../Models/Wiki/State"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { StateL10n } from "../Schema/States/States.l10n"
import { YamlFileConverter } from "../ToRecordsByFile"
import { toErrata } from "./toErrata"
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
                          yaml_mp => yaml_mp.StatesL10n,
                          map (toState),
                          toMapIntegrity,
                          second (fromMap)
                        )
