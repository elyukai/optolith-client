/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray } from "../../../../Data/List"
import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Cantrip } from "../../../Models/Wiki/Cantrip"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { CantripL10n } from "../Schema/Cantrips/Cantrips.l10n"
import { CantripUniv } from "../Schema/Cantrips/Cantrips.univ"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./toErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./ToSourceRefs"


const toCantrip : YamlPairConverterE<CantripUniv, CantripL10n, string, Cantrip>
                = ([ univ, l10n ]) => Right<[string, Record<Cantrip>]> ([
                    univ.id,
                    Cantrip ({
                      id: univ .id,
                      name: l10n.name,
                      property: univ.property,
                      tradition: fromArray (univ.traditions),
                      effect: toMarkdown (l10n.effect),
                      range: l10n.range,
                      duration: l10n.duration,
                      target: l10n.target,
                      note: Maybe (l10n.note),
                      src: toSourceRefs (l10n.src),
                      errata: toErrata (l10n.errata),
                      category: Nothing,
                    }),
                  ])


export const toCantrips : YamlFileConverter<string, Record<Cantrip>>
                      = pipe (
                          (yaml_mp : YamlNameMap) => zipBy ("id")
                                                           (yaml_mp.CantripsUniv)
                                                           (yaml_mp.CantripsL10n),
                          bindF (pipe (
                            mapM (toCantrip),
                            bindF (toMapIntegrity),
                          )),
                          second (fromMap)
                        )
