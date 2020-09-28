/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { DominationRitualL10n } from "../../../../../app/Database/Schema/DominationRituals/DominationRituals.l10n"
import { DominationRitualUniv } from "../../../../../app/Database/Schema/DominationRituals/DominationRituals.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { Maybe } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Tuple } from "../../../../Data/Tuple"
import { DominationRitual as DR } from "../../../Models/Wiki/DominationRitual"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./ToSourceRefs"


const toDR : YamlPairConverterE<DominationRitualUniv, DominationRitualL10n, string, DR>
           = ([ univ, l10n ]) => Right<[string, Record<DR>]> ([
               univ.id,
               DR ({
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


export const toDominationRituals : YamlFileConverter<string, Record<DR>>
                                 = pipe (
                                     (yaml_mp : YamlNameMap) =>
                                       zipBy ("id")
                                             (yaml_mp.DominationRitualsUniv)
                                             (yaml_mp.DominationRitualsL10nDefault)
                                             (yaml_mp.DominationRitualsL10nOverride),
                                     bindF (pipe (
                                       mapM (toDR),
                                       bindF (toMapIntegrity),
                                     )),
                                     second (fromMap)
                                   )
