/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ArcaneDancerTraditionL10n } from "../../../../../app/Database/Schema/ArcaneDancerTraditions/ArcaneDancerTraditions.l10n"
import { ArcaneDancerTraditionUniv } from "../../../../../app/Database/Schema/ArcaneDancerTraditions/ArcaneDancerTraditions.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fmapF } from "../../../../Data/Functor"
import { List } from "../../../../Data/List"
import { catMaybes, Just, Maybe } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { ArcaneDancerTradition } from "../../../Models/Wiki/ArcaneDancerTradition"
import { AllRequirementObjects } from "../../../Models/Wiki/wikiTypeHelpers"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toCulturePrerequisite, toSexPrerequisite } from "./ToPrerequisites"


const toArcaneDancerTradition
  : YamlPairConverterE<
      ArcaneDancerTraditionUniv,
      ArcaneDancerTraditionL10n,
      number,
      ArcaneDancerTradition
    >
  = ([ univ, l10n ]) => Right<[number, Record<ArcaneDancerTradition>]> ([
      univ.id,
      ArcaneDancerTradition ({
        id: univ .id,
        name: l10n.name,
        prerequisites: catMaybes (List<Maybe<AllRequirementObjects>> (
          fmapF (Maybe (univ.prerequisites.sexPrerequisite))
                (toSexPrerequisite),
          Just (toCulturePrerequisite (univ.prerequisites.culturePrerequisite)),
        )),
      }),
    ])


export const toArcaneDancerTraditions : YamlFileConverter<number, Record<ArcaneDancerTradition>>
                             = pipe (
                                 (yaml_mp : YamlNameMap) =>
                                   zipBy ("id")
                                         (yaml_mp.ArcaneDancerTraditionsUniv)
                                         (yaml_mp.ArcaneDancerTraditionsL10nDefault)
                                         (yaml_mp.ArcaneDancerTraditionsL10nOverride),
                                 bindF (pipe (
                                   mapM (toArcaneDancerTradition),
                                   bindF (toMapIntegrity),
                                 )),
                                 second (fromMap)
                               )
