/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { bindF, Right, second } from "../../../../Data/Either"
import { fromMap, insert, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { EquipmentPackage } from "../../../Models/Wiki/EquipmentPackage"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { EquipmentPackageL10n } from "../Schema/EquipmentPackages/EquipmentPackages.l10n"
import { EquipmentPackageUniv } from "../Schema/EquipmentPackages/EquipmentPackages.univ"
import { YamlNameMap } from "../SchemaMap"
import { YamlFileConverter, YamlPairConverterE } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"


// eslint-disable-next-line max-len
const toEPKG : YamlPairConverterE<EquipmentPackageUniv, EquipmentPackageL10n, string, EquipmentPackage>
                = ([ univ, l10n ]) => Right<[string, Record<EquipmentPackage>]> ([
                    univ.id,
                    EquipmentPackage ({
                      id: univ.id,
                      name: l10n.name,
                      items: univ.items.reduce<OrderedMap<string, number>> (
                        (acc, { id, amount = 1 }) => insert (id) (amount) (acc),
                        OrderedMap.empty
                      ),
                    }),
                  ])


export const toEquipmentPackages : YamlFileConverter<string, Record<EquipmentPackage>>
                                 = pipe (
                                     (yaml_mp : YamlNameMap) =>
                                       zipBy ("id")
                                             (yaml_mp.EquipmentPackagesUniv)
                                             (yaml_mp.EquipmentPackagesL10n)
                                             (yaml_mp.EquipmentPackagesDefault),
                                     bindF (pipe (
                                       mapM (toEPKG),
                                       bindF (toMapIntegrity),
                                     )),
                                     second (fromMap)
                                   )
