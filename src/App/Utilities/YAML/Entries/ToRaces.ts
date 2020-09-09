/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { RaceL10n } from "../../../../../app/Database/Schema/Races/Races.l10n"
import { RaceUniv, RaceWithVariantsUniv } from "../../../../../app/Database/Schema/Races/Races.univ"
import { bindF, second } from "../../../../Data/Either"
import { fromArray, List } from "../../../../Data/List"
import { Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Pair } from "../../../../Data/Tuple"
import { Race } from "../../../Models/Wiki/Race"
import { Die } from "../../../Models/Wiki/sub/Die"
import { hasOwnProperty } from "../../Object"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverter } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toErrata } from "./ToErrata"
import { toSourceRefs } from "./ToSourceRefs"


const hasRaceVariants : (race : RaceUniv) => race is RaceWithVariantsUniv
                      = (race) : race is RaceWithVariantsUniv => hasOwnProperty ("variants") (race)


// toRace: univ = {
//   "id": "R_1",
//   "cost": 0,
//   "lp": 5,
//   "spi": -5,
//   "tou": -5,
//   "mov": 8,
//   "attributeAdjustmentsSelectionValue": 1,
//   "attributeAdjustmentsSelectionList": [
//     "ATTR_1",
//     "ATTR_2",
//     "ATTR_3",
//     "ATTR_4",
//     "ATTR_5",
//     "ATTR_6",
//     "ATTR_7",
//     "ATTR_8"
//   ],
//   "weightBase": 100,
//   "weightRandom": [
//     {
//       "amount": 2,
//       "sides": 6
//     }
//   ],
//   "variants": [
//     "RV_1",
//     "RV_2",
//     "RV_3",
//     "RV_4",
//     "RV_5",
//     "RV_6",
//     "RV_7"
//   ]
// }
// toRace: l10n = {
//   "id": "R_1",
//   "name": "Menschen",
//   "attributeAdjustments": "eine beliebige Eigenschaft nach Wahl +1",
//   "src": [
//     {
//       "id": "US25001",
//       "firstPage": 89
//     }
//   ]
// }


const toRace : YamlPairConverter<RaceUniv, RaceL10n, string, Race>
             = ([ univ, l10n ]) => {
                 if (hasRaceVariants (univ)) {
                   return [
                     univ.id,
                     Race ({
                       id: univ.id,
                       name: l10n.name,
                       ap: univ.cost,
                       lp: univ.lp,
                       spi: univ.spi,
                       tou: univ.tou,
                       mov: univ.mov,
                       attributeAdjustments: fromArray (
                         (univ.attributeAdjustments ?? [])
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
                     }),
                   ]
                 }

                 return [
                   univ.id,
                   Race ({
                     id: univ.id,
                     name: l10n.name,
                     ap: univ.cost,
                     lp: univ.lp,
                     spi: univ.spi,
                     tou: univ.tou,
                     mov: univ.mov,
                     attributeAdjustments: fromArray (
                       (univ.attributeAdjustments ?? [])
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
                 ]
               }


export const toRaces : YamlFileConverter<string, Record<Race>>
                     = pipe (
                         (yaml_mp : YamlNameMap) =>
                           zipBy ("id")
                                 (yaml_mp.RacesUniv)
                                 (yaml_mp.RacesL10nDefault)
                                 (yaml_mp.RacesL10nOverride),
                         bindF (pipe (
                           map (toRace),
                           toMapIntegrity,
                         )),
                         second (fromMap),
                       )
