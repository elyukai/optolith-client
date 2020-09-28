/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { GeodeRitualL10n } from "../../../../../app/Database/Schema/GeodeRituals/GeodeRituals.l10n"
import { GeodeRitualUniv } from "../../../../../app/Database/Schema/GeodeRituals/GeodeRituals.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray } from "../../../../Data/List"
import { Maybe } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Tuple } from "../../../../Data/Tuple"
import { GeodeRitual } from "../../../Models/Wiki/GeodeRitual"
import { ndash } from "../../Chars"
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


const toGeodeRitual : YamlPairConverterE<GeodeRitualUniv, GeodeRitualL10n, string, GeodeRitual>
                    = ([ univ, l10n ]) => Right<[string, Record<GeodeRitual>]> ([
                        univ.id,
                        GeodeRitual ({
                          id: univ .id,
                          name: l10n.name,
                          check: Tuple (univ.check1, univ.check2, univ.check3),
                          checkmod: Maybe (univ.checkMod),
                          property: univ.property,
                          prerequisites: fromArray (
                            univ.activatablePrerequisites
                              .map (toActivatablePrerequisite)
                          ),
                          effect: toMarkdown (l10n.effect),
                          castingTime: ndash,
                          castingTimeShort: ndash,
                          cost: l10n.aeCost,
                          costShort: l10n.aeCostShort,
                          range: l10n.range,
                          rangeShort: l10n.rangeShort,
                          duration: l10n.duration,
                          durationShort: l10n.durationShort,
                          target: l10n.target,
                          src: toSourceRefs (l10n.src),
                          errata: toErrata (l10n.errata),
                        }),
                      ])


export const toGeodeRituals : YamlFileConverter<string, Record<GeodeRitual>>
                            = pipe (
                                (yaml_mp : YamlNameMap) => zipBy ("id")
                                                                 (yaml_mp.GeodeRitualsUniv)
                                                                 (yaml_mp.GeodeRitualsL10nDefault)
                                                                 (yaml_mp.GeodeRitualsL10nOverride),
                                bindF (pipe (
                                  mapM (toGeodeRitual),
                                  bindF (toMapIntegrity),
                                )),
                                second (fromMap)
                              )
