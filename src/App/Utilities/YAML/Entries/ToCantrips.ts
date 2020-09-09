/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { CantripL10n } from "../../../../../app/Database/Schema/Cantrips/Cantrips.l10n"
import { CantripUniv } from "../../../../../app/Database/Schema/Cantrips/Cantrips.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray, List } from "../../../../Data/List"
import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Cantrip } from "../../../Models/Wiki/Cantrip"
import { RequireActivatable } from "../../../Models/Wiki/prerequisites/ActivatableRequirement"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown } from "./ToMarkdown"
import { toActivatablePrerequisite } from "./ToPrerequisites"
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
                      prerequisites: List<Record<RequireActivatable>> (
                        ...(univ.activatablePrerequisites ?? [])
                          .map (toActivatablePrerequisite),
                      ),
                      src: toSourceRefs (l10n.src),
                      errata: toErrata (l10n.errata),
                      category: Nothing,
                    }),
                  ])


export const toCantrips : YamlFileConverter<string, Record<Cantrip>>
                      = pipe (
                          (yaml_mp : YamlNameMap) => zipBy ("id")
                                                           (yaml_mp.CantripsUniv)
                                                           (yaml_mp.CantripsL10nDefault)
                                                           (yaml_mp.CantripsL10nOverride),
                          bindF (pipe (
                            mapM (toCantrip),
                            bindF (toMapIntegrity),
                          )),
                          second (fromMap)
                        )
