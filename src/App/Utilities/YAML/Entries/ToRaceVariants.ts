/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { RaceVariantL10n } from "../../../../../app/Database/Schema/RaceVariants/RaceVariants.l10n"
import { RaceVariantUniv } from "../../../../../app/Database/Schema/RaceVariants/RaceVariants.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromArray } from "../../../../Data/List"
import { Maybe, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { RaceVariant } from "../../../Models/Wiki/RaceVariant"
import { Die } from "../../../Models/Wiki/sub/Die"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"


const toRaceVariant : YamlPairConverterE<RaceVariantUniv, RaceVariantL10n, string, RaceVariant>
                = ([ univ, l10n ]) => Right<[string, Record<RaceVariant>]> ([
                    univ.id,
                    RaceVariant ({
                      id: univ.id,
                      name: l10n.name,
                      commonCultures: fromArray (univ.commonCultures),
                      commonAdvantages: fromArray (univ.commonAdvantages ?? []),
                      commonAdvantagesText: Maybe (l10n.commonAdvantages),
                      commonDisadvantages: fromArray (univ.commonDisadvantages ?? []),
                      commonDisadvantagesText: Maybe (l10n.commonDisadvantages),
                      uncommonAdvantages: fromArray (univ.uncommonAdvantages ?? []),
                      uncommonAdvantagesText: Maybe (l10n.uncommonAdvantages),
                      uncommonDisadvantages: fromArray (univ.uncommonDisadvantages ?? []),
                      uncommonDisadvantagesText: Maybe (l10n.uncommonDisadvantages),
                      hairColors: fromArray (univ.hairColors),
                      eyeColors: fromArray (univ.eyeColors),
                      sizeBase: univ.sizeBase,
                      sizeRandom: fromArray (univ.sizeRandom .map (Die)),
                      category: Nothing,
                    }),
                  ])


export const toRaceVariants : YamlFileConverter<string, Record<RaceVariant>>
                                 = pipe (
                                     (yaml_mp : YamlNameMap) =>
                                       zipBy ("id")
                                             (yaml_mp.RaceVariantsUniv)
                                             (yaml_mp.RaceVariantsL10nDefault)
                                             (yaml_mp.RaceVariantsL10nOverride),
                                     bindF (pipe (
                                       mapM (toRaceVariant),
                                       bindF (toMapIntegrity),
                                     )),
                                     second (fromMap)
                                   )
