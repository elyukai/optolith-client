/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { EquipmentPackageL10n } from "../../../../../app/Database/Schema/EquipmentPackages/EquipmentPackages.l10n"
import { EquipmentPackageUniv } from "../../../../../app/Database/Schema/EquipmentPackages/EquipmentPackages.univ"
import { bindF, Right, second } from "../../../../Data/Either"
import { fromMap, insert, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { EquipmentPackage } from "../../../Models/Wiki/EquipmentPackage"
import { pipe } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
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
                                             (yaml_mp.EquipmentPackagesL10nDefault)
                                             (yaml_mp.EquipmentPackagesL10nOverride),
                                     bindF (pipe (
                                       mapM (toEPKG),
                                       bindF (toMapIntegrity),
                                     )),
                                     second (fromMap)
                                   )
