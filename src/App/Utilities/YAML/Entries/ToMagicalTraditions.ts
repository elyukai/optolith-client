/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { MagicalTraditionL10n } from "../../../../../app/Database/Schema/MagicalTraditions/MagicalTraditions.l10n"
import { MagicalTraditionUniv } from "../../../../../app/Database/Schema/MagicalTraditions/MagicalTraditions.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { Maybe } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { AttrId } from "../../../Constants/Ids"
import { MagicalTradition } from "../../../Models/Wiki/MagicalTradition"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"


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
                      canLearnCantrips: univ.canLearnCantrips,
                      canLearnSpells: univ.canLearnSpells,
                      canLearnRituals: univ.canLearnRituals,
                      allowMultipleTraditions: univ.allowMultipleTraditions,
                      isDisAdvAPMaxHalved: univ.isDisAdvAPMaxHalved,
                      areDisAdvRequiredApplyToMagActionsOrApps:
                        univ.areDisAdvRequiredApplyToMagActionsOrApps,
                    }),
                  ])


export const toMagicalTraditions : YamlFileConverter<string, Record<MagicalTradition>>
                                 = pipe (
                                     (yaml_mp : YamlNameMap) =>
                                       zipBy ("id")
                                             (yaml_mp.MagicalTraditionsUniv)
                                             (yaml_mp.MagicalTraditionsL10nDefault)
                                             (yaml_mp.MagicalTraditionsL10nOverride),
                                     bindF (pipe (
                                       mapM (toMT),
                                       bindF (toMapIntegrity),
                                     )),
                                     second (fromMap)
                                   )
