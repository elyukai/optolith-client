/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { CurseL10n } from "../../../../../app/Database/Schema/Curses/Curses.l10n"
import { CurseUniv } from "../../../../../app/Database/Schema/Curses/Curses.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { Maybe } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Tuple } from "../../../../Data/Tuple"
import { Curse } from "../../../Models/Wiki/Curse"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./ToSourceRefs"


const toCurse : YamlPairConverterE<CurseUniv, CurseL10n, string, Curse>
              = ([ univ, l10n ]) => Right<[string, Record<Curse>]> ([
                    univ.id,
                    Curse ({
                      id: univ .id,
                      name: l10n.name,
                      check: Tuple (univ.check1, univ.check2, univ.check3),
                      checkmod: Maybe (univ.checkMod),
                      property: univ.property,
                      effect: toMarkdown (l10n.effect),
                      cost: l10n.aeCost,
                      costShort: l10n.aeCostShort,
                      duration: l10n.duration,
                      durationShort: l10n.durationShort,
                      src: toSourceRefs (l10n.src),
                      errata: toErrata (l10n.errata),
                    }),
                  ])


export const toCurses : YamlFileConverter<string, Record<Curse>>
                      = pipe (
                          (yaml_mp : YamlNameMap) => zipBy ("id")
                                                           (yaml_mp.CursesUniv)
                                                           (yaml_mp.CursesL10nDefault)
                                                           (yaml_mp.CursesL10nOverride),
                          bindF (pipe (
                            mapM (toCurse),
                            bindF (toMapIntegrity),
                          )),
                          second (fromMap)
                        )
