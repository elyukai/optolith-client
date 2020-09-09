/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { AnimistForceL10n } from "../../../../../app/Database/Schema/AnimistForces/AnimistForces.l10n"
import { AnimistForceUniv } from "../../../../../app/Database/Schema/AnimistForces/AnimistForces.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray } from "../../../../Data/List"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Tuple } from "../../../../Data/Tuple"
import { AnimistForce } from "../../../Models/Wiki/AnimistForce"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./ToSourceRefs"


const toAnimistForce : YamlPairConverterE<AnimistForceUniv, AnimistForceL10n, string, AnimistForce>
                     = ([ univ, l10n ]) => Right<[string, Record<AnimistForce>]> ([
                         univ.id,
                         AnimistForce ({
                           id: univ .id,
                           name: l10n.name,
                           check: Tuple (univ.check1, univ.check2, univ.check3),
                           ic: univ .ic,
                           property: univ.property,
                           tribes: fromArray (univ.tribes ?? []),
                           effect: toMarkdown (l10n.effect),
                           cost: l10n.aeCost,
                           costShort: l10n.aeCostShort,
                           duration: l10n.duration,
                           durationShort: l10n.durationShort,
                           src: toSourceRefs (l10n.src),
                           errata: toErrata (l10n.errata),
                         }),
                       ])


export const toAnimistForces : YamlFileConverter<string, Record<AnimistForce>>
                             = pipe (
                                 (yaml_mp : YamlNameMap) =>
                                   zipBy ("id")
                                         (yaml_mp.AnimistForcesUniv)
                                         (yaml_mp.AnimistForcesL10nDefault)
                                         (yaml_mp.AnimistForcesL10nOverride),
                                 bindF (pipe (
                                   mapM (toAnimistForce),
                                   bindF (toMapIntegrity),
                                 )),
                                 second (fromMap)
                               )
