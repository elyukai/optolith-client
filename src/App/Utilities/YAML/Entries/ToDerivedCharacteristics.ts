/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { DerivedCharacteristicId, DerivedCharacteristicL10n } from "../../../../../app/Database/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"
import { second } from "../../../../Data/Either"
import { Maybe } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { DerivedCharacteristic } from "../../../Models/Wiki/DerivedCharacteristic"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { mergeBy } from "../ZipById"


type DCId = DerivedCharacteristicId


const toDC : (l10n : DerivedCharacteristicL10n) => [DCId, Record<DerivedCharacteristic>]
           = l10n => [
               l10n.id,
               DerivedCharacteristic ({
                 id: l10n.id,
                 name: l10n.name,
                 short: l10n.short,
                 calc: l10n.calc,
                 calcHalfPrimary: Maybe (l10n.calcHalfPrimary),
                 calcNoPrimary: Maybe (l10n.calcNoPrimary),
               }),
             ]


export const toDerivedCharacteristics : YamlFileConverter<DCId, Record<DerivedCharacteristic>>
                                      = pipe (
                                          yaml_mp =>
                                            mergeBy ("id")
                                                    (yaml_mp.DerivedCharacteristicsL10nDefault)
                                                    (yaml_mp.DerivedCharacteristicsL10nOverride),
                                          map (toDC),
                                          toMapIntegrity,
                                          second (fromMap)
                                        )
