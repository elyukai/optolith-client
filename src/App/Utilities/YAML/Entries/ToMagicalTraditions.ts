/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { bindF, Right, second } from "../../../../Data/Either"
import { Maybe } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { AttrId } from "../../../Constants/Ids"
import { MagicalTradition } from "../../../Models/Wiki/MagicalTradition"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { MagicalTraditionL10n } from "../Schema/MagicalTraditions/MagicalTraditions.l10n"
import { MagicalTraditionUniv } from "../Schema/MagicalTraditions/MagicalTraditions.univ"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipById } from "../ZipById"


// eslint-disable-next-line max-len
const toMT : YamlPairConverterE<MagicalTraditionUniv, MagicalTraditionL10n, string, MagicalTradition>
                = ([ univ, l10n ]) => Right<[string, Record<MagicalTradition>]> ([
                    univ.id,
                    MagicalTradition ({
                      id: univ.id,
                      numId: Maybe (univ.numId),
                      name: l10n.name,
                      primary: Maybe (univ.primary) as Maybe<AttrId>,
                      aeMod: Maybe (univ.aeMod),
                    }),
                  ])


export const toMagicalTraditions : YamlFileConverter<string, Record<MagicalTradition>>
                                 = pipe (
                                     (yaml_mp : YamlNameMap) =>
                                       zipById (yaml_mp.MagicalTraditionsUniv)
                                               (yaml_mp.MagicalTraditionsL10n),
                                     bindF (pipe (
                                       mapM (toMT),
                                       bindF (toMapIntegrity),
                                     )),
                                     second (fromMap)
                                   )
