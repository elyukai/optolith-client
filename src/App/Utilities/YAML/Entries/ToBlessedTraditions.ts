/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { BlessedTraditionL10n } from "../../../../../app/Database/Schema/BlessedTraditions/BlessedTraditions.l10n"
import { BlessedTraditionUniv } from "../../../../../app/Database/Schema/BlessedTraditions/BlessedTraditions.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fmapF } from "../../../../Data/Functor"
import { Maybe } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Pair } from "../../../../Data/Tuple"
import { AttrId } from "../../../Constants/Ids"
import { BlessedTradition } from "../../../Models/Wiki/BlessedTradition"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"


// eslint-disable-next-line max-len
const toBT : YamlPairConverterE<BlessedTraditionUniv, BlessedTraditionL10n, string, BlessedTradition>
           = ([ univ, l10n ]) => Right<[string, Record<BlessedTradition>]> ([
               univ.id,
               BlessedTradition ({
                 id: univ.id,
                 numId: univ.numId,
                 name: l10n.name,
                 primary: univ.primary as AttrId,
                 aspects: fmapF (Maybe (univ.aspects)) (([ f, s ]) => Pair (f, s)),
               }),
             ])


export const toBlessedTraditions : YamlFileConverter<string, Record<BlessedTradition>>
                                 = pipe (
                                     (yaml_mp : YamlNameMap) =>
                                       zipBy ("id")
                                             (yaml_mp.BlessedTraditionsUniv)
                                             (yaml_mp.BlessedTraditionsL10nDefault)
                                             (yaml_mp.BlessedTraditionsL10nOverride),
                                     bindF (pipe (
                                       mapM (toBT),
                                       bindF (toMapIntegrity),
                                     )),
                                     second (fromMap)
                                   )
