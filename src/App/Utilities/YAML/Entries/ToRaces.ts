/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray, List } from "../../../../Data/List"
import { Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Pair } from "../../../../Data/Tuple"
import { Race } from "../../../Models/Wiki/Race"
import { Die } from "../../../Models/Wiki/sub/Die"
import { hasOwnProperty } from "../../Object"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { RaceL10n } from "../Schema/Races/Races.l10n"
import { RaceUniv, RaceWithVariantsUniv } from "../Schema/Races/Races.univ"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipById } from "../ZipById"
import { toErrata } from "./toErrata"
import { toSourceRefs } from "./toSourceRefs"


const hasRaceVariants : (race : RaceUniv) => race is RaceWithVariantsUniv
                      = (race) : race is RaceWithVariantsUniv => hasOwnProperty ("variants") (race)


const toRace : YamlPairConverterE<RaceUniv, RaceL10n, string, Race>
             = ([ univ, l10n ]) => Right<[string, Record<Race>]> ([
                 univ.id,
                 hasRaceVariants (univ)
                 ? Race ({
                     id: univ.id,
                     name: l10n.name,
                     ap: univ.cost,
                     lp: univ.lp,
                     spi: univ.spi,
                     tou: univ.tou,
                     mov: univ.mov,
                     attributeAdjustments: fromArray (
                       univ.attributeAdjustments
                         .map (x => Pair (x.id, x.value))
                     ),
                     attributeAdjustmentsSelection: Pair (
                       univ.attributeAdjustmentsSelectionValue,
                       fromArray (univ.attributeAdjustmentsSelectionList),
                     ),
                     attributeAdjustmentsText: l10n.attributeAdjustments,
                     commonCultures: List (),
                     automaticAdvantages: fromArray (univ.automaticAdvantages ?? []),
                     automaticAdvantagesText: Maybe (l10n.automaticAdvantages),
                     stronglyRecommendedAdvantages:
                       fromArray (univ.stronglyRecommendedAdvantages ?? []),
                     stronglyRecommendedAdvantagesText:
                       Maybe (l10n.stronglyRecommendedAdvantages),
                     stronglyRecommendedDisadvantages:
                       fromArray (univ.stronglyRecommendedDisadvantages ?? []),
                     stronglyRecommendedDisadvantagesText:
                       Maybe (l10n.stronglyRecommendedDisadvantages),
                     commonAdvantages: fromArray (univ.commonAdvantages ?? []),
                     commonAdvantagesText: Maybe (l10n.commonAdvantages),
                     commonDisadvantages: fromArray (univ.commonDisadvantages ?? []),
                     commonDisadvantagesText: Maybe (l10n.commonDisadvantages),
                     uncommonAdvantages: fromArray (univ.uncommonAdvantages ?? []),
                     uncommonAdvantagesText: Maybe (l10n.uncommonAdvantages),
                     uncommonDisadvantages: fromArray (univ.uncommonDisadvantages ?? []),
                     uncommonDisadvantagesText: Maybe (l10n.uncommonDisadvantages),
                     weightBase: univ.weightBase,
                     weightRandom: fromArray (univ.weightRandom .map (Die)),
                     variants: fromArray (univ.variants),
                     src: toSourceRefs (l10n.src),
                     errata: toErrata (l10n.errata),
                     category: Nothing,
                   })
                 : Race ({
                     id: univ.id,
                     name: l10n.name,
                     ap: univ.cost,
                     lp: univ.lp,
                     spi: univ.spi,
                     tou: univ.tou,
                     mov: univ.mov,
                     attributeAdjustments: fromArray (
                       univ.attributeAdjustments
                         .map (x => Pair (x.id, x.value))
                     ),
                     attributeAdjustmentsSelection: Pair (
                       univ.attributeAdjustmentsSelectionValue,
                       fromArray (univ.attributeAdjustmentsSelectionList),
                     ),
                     attributeAdjustmentsText: l10n.attributeAdjustments,
                     commonCultures: fromArray (univ.commonCultures),
                     automaticAdvantages: fromArray (univ.automaticAdvantages ?? []),
                     automaticAdvantagesText: Maybe (l10n.automaticAdvantages),
                     stronglyRecommendedAdvantages:
                       fromArray (univ.stronglyRecommendedAdvantages ?? []),
                     stronglyRecommendedAdvantagesText:
                       Maybe (l10n.stronglyRecommendedAdvantages),
                     stronglyRecommendedDisadvantages:
                       fromArray (univ.stronglyRecommendedDisadvantages ?? []),
                     stronglyRecommendedDisadvantagesText:
                       Maybe (l10n.stronglyRecommendedDisadvantages),
                     commonAdvantages: fromArray (univ.commonAdvantages ?? []),
                     commonAdvantagesText: Maybe (l10n.commonAdvantages),
                     commonDisadvantages: fromArray (univ.commonDisadvantages ?? []),
                     commonDisadvantagesText: Maybe (l10n.commonDisadvantages),
                     uncommonAdvantages: fromArray (univ.uncommonAdvantages ?? []),
                     uncommonAdvantagesText: Maybe (l10n.uncommonAdvantages),
                     uncommonDisadvantages: fromArray (univ.uncommonDisadvantages ?? []),
                     uncommonDisadvantagesText: Maybe (l10n.uncommonDisadvantages),
                     hairColors: Just (fromArray (univ.hairColors)),
                     eyeColors: Just (fromArray (univ.eyeColors)),
                     sizeBase: Just (univ.sizeBase),
                     sizeRandom: Just (fromArray (univ.sizeRandom .map (Die))),
                     weightBase: univ.weightBase,
                     weightRandom: fromArray (univ.weightRandom .map (Die)),
                     variants: List (),
                     src: toSourceRefs (l10n.src),
                     errata: toErrata (l10n.errata),
                     category: Nothing,
                   }),
               ])


export const toRaces : YamlFileConverter<string, Record<Race>>
                     = pipe (
                         (yaml_mp : YamlNameMap) =>
                           zipById (yaml_mp.RacesUniv)
                                   (yaml_mp.RacesL10n),
                         bindF (pipe (
                           mapM (toRace),
                           bindF (toMapIntegrity),
                         )),
                         second (fromMap)
                       )
