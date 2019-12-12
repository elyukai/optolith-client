import { List } from "../../../Data/List";
import { isJust, Just, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { EditPrimaryAttributeDamageThreshold } from "./EditPrimaryAttributeDamageThreshold";
import { ItemEditorSpecific } from "./heroTypeHelpers";
import { ItemBase } from "./Item";

export interface EditItem extends ItemBase, ItemEditorSpecific {
  "@@name": "EditItem"
}

export interface EditItemSafe extends EditItem {
  id: Just<string>
}

export const EditItem =
  fromDefault ("EditItem")
              <EditItem> ({
                id: Nothing,
                name: "",
                ammunition: Nothing,
                combatTechnique: Nothing,
                damageDiceSides: Nothing,
                gr: 0,
                isParryingWeapon: false,
                isTemplateLocked: false,
                reach: Nothing,
                template: Nothing,
                where: Nothing,
                isTwoHandedWeapon: false,
                improvisedWeaponGroup: Nothing,
                loss: Nothing,
                forArmorZoneOnly: false,
                addPenalties: false,
                armorType: Nothing,
                at: "",
                iniMod: "",
                movMod: "",
                damageBonus: EditPrimaryAttributeDamageThreshold .default,
                damageDiceNumber: "",
                damageFlat: "",
                enc: "",
                length: "",
                amount: "",
                pa: "",
                price: "",
                pro: "",
                range: List ("", "", ""),
                reloadTime: "",
                stp: "",
                weight: "",
                stabilityMod: "",
              })

export const EditItemL = makeLenses (EditItem)

export const ensureEditId =
  (x: Record<EditItem>): x is Record<EditItemSafe> => isJust (EditItem.AL.id (x))
