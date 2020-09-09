/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { MagicalDanceL10n } from "../../../../../app/Database/Schema/MagicalDances/MagicalDances.l10n"
import { MagicalDanceUniv } from "../../../../../app/Database/Schema/MagicalDances/MagicalDances.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray } from "../../../../Data/List"
import { fromMap, insert, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Tuple } from "../../../../Data/Tuple"
import { NumIdName } from "../../../Models/NumIdName"
import { MagicalDance } from "../../../Models/Wiki/MagicalDance"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toMarkdown } from "./ToMarkdown"
import { toSourceRefs } from "./ToSourceRefs"


const toMagicalDance : YamlPairConverterE<MagicalDanceUniv, MagicalDanceL10n, string, MagicalDance>
                     = ([ univ, l10n ]) => Right<[string, Record<MagicalDance>]> ([
                         univ.id,
                         MagicalDance ({
                           id: univ .id,
                           name: l10n.name,
                           nameByTradition:
                             l10n.nameByTradition.reduce<OrderedMap<number, Record<NumIdName>>> (
                               (mp, { id, name }) => insert (id) (NumIdName ({ id, name })) (mp),
                               OrderedMap.empty
                             ),
                           check: Tuple (univ.check1, univ.check2, univ.check3),
                           ic: univ .ic,
                           property: univ.property,
                           musictraditions: fromArray (univ.musictraditions),
                           effect: toMarkdown (l10n.effect),
                           cost: l10n.aeCost,
                           costShort: l10n.aeCostShort,
                           duration: l10n.duration,
                           durationShort: l10n.durationShort,
                           src: toSourceRefs (l10n.src),
                           errata: toErrata (l10n.errata),
                         }),
                       ])


export const toMagicalDances : YamlFileConverter<string, Record<MagicalDance>>
                             = pipe (
                                 (yaml_mp : YamlNameMap) =>
                                   zipBy ("id")
                                         (yaml_mp.MagicalDancesUniv)
                                         (yaml_mp.MagicalDancesL10nDefault)
                                         (yaml_mp.MagicalDancesL10nOverride),
                                 bindF (pipe (
                                   mapM (toMagicalDance),
                                   bindF (toMapIntegrity),
                                 )),
                                 second (fromMap)
                               )
