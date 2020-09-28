/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { ArcaneBardTraditionL10n } from "../../../../../app/Database/Schema/ArcaneBardTraditions/ArcaneBardTraditions.l10n"
import { ArcaneBardTraditionUniv } from "../../../../../app/Database/Schema/ArcaneBardTraditions/ArcaneBardTraditions.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fmapF } from "../../../../Data/Functor"
import { List } from "../../../../Data/List"
import { catMaybes, Just, Maybe } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { ArcaneBardTradition } from "../../../Models/Wiki/ArcaneBardTradition"
import { AllRequirementObjects } from "../../../Models/Wiki/wikiTypeHelpers"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"
import { toCulturePrerequisite, toSexPrerequisite } from "./ToPrerequisites"


const toArcaneBardTradition
  : YamlPairConverterE<
      ArcaneBardTraditionUniv,
      ArcaneBardTraditionL10n,
      number,
      ArcaneBardTradition
    >
  = ([ univ, l10n ]) => Right<[number, Record<ArcaneBardTradition>]> ([
      univ.id,
      ArcaneBardTradition ({
        id: univ .id,
        name: l10n.name,
        prerequisites: catMaybes (List<Maybe<AllRequirementObjects>> (
          fmapF (Maybe (univ.prerequisites.sexPrerequisite))
                (toSexPrerequisite),
          Just (toCulturePrerequisite (univ.prerequisites.culturePrerequisite)),
        )),
      }),
    ])


export const toArcaneBardTraditions : YamlFileConverter<number, Record<ArcaneBardTradition>>
                             = pipe (
                                 (yaml_mp : YamlNameMap) =>
                                   zipBy ("id")
                                         (yaml_mp.ArcaneBardTraditionsUniv)
                                         (yaml_mp.ArcaneBardTraditionsL10nDefault)
                                         (yaml_mp.ArcaneBardTraditionsL10nOverride),
                                 bindF (pipe (
                                   mapM (toArcaneBardTradition),
                                   bindF (toMapIntegrity),
                                 )),
                                 second (fromMap)
                               )
