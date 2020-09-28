/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { BlessingL10n } from "../../../../../app/Database/Schema/Blessings/Blessings.l10n"
import { BlessingUniv } from "../../../../../app/Database/Schema/Blessings/Blessings.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray } from "../../../../Data/List"
import { Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Blessing } from "../../../Models/Wiki/Blessing"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./ToSourceRefs"


const toBlessing : YamlPairConverterE<BlessingUniv, BlessingL10n, string, Blessing>
           = ([ univ, l10n ]) => Right<[string, Record<Blessing>]> ([
               univ.id,
               Blessing ({
                 id: univ .id,
                 name: l10n.name,
                 tradition: fromArray (univ.traditions),
                 effect: toMarkdown (l10n.effect),
                 range: l10n.range,
                 duration: l10n.duration,
                 target: l10n.target,
                 src: toSourceRefs (l10n.src),
                 errata: toErrata (l10n.errata),
                 category: Nothing,
               }),
             ])


export const toBlessings : YamlFileConverter<string, Record<Blessing>>
                                = pipe (
                                    (yaml_mp : YamlNameMap) =>
                                      zipBy ("id")
                                            (yaml_mp.BlessingsUniv)
                                            (yaml_mp.BlessingsL10nDefault)
                                            (yaml_mp.BlessingsL10nOverride),
                                    bindF (pipe (
                                      mapM (toBlessing),
                                      bindF (toMapIntegrity),
                                    )),
                                    second (fromMap)
                                  )
