import { OrderedMap } from "../../../Data/OrderedMap"
import { fromDefault } from "../../../Data/Record"

export interface EquipmentPackage {
  "@@name": "EquipmentPackage"
  id: string
  name: string
  items: OrderedMap<string, number>
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EquipmentPackage =
  fromDefault ("EquipmentPackage")
              <EquipmentPackage> ({
                id: "",
                name: "",
                items: OrderedMap.empty,
              })
