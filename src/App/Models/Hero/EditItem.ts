import { set } from "../../../Data/Lens";
import { List } from "../../../Data/List";
import { isJust, Just, Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { itemToEditable } from "../../Utilities/ItemUtils";
import { pipe } from "../../Utilities/pipe";
import { EditPrimaryAttributeDamageThreshold } from "./EditPrimaryAttributeDamageThreshold";
import { ItemEditorSpecific } from "./heroTypeHelpers";
import { fromItemTemplate, ItemBase } from "./Item";

export interface EditItem extends ItemBase, ItemEditorSpecific { }

export interface EditItemSafe extends EditItem {
  id: Just<string>
}

export const EditItem =
  fromDefault<EditItem> ({
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
  (x: Record<EditItem>): x is Record<EditItemSafe> => isJust (EditItem.A.id (x))

export const fromItemTemplateEdit =
  (new_id: Maybe<string>) =>
    pipe (
      fromItemTemplate (""),
      itemToEditable,
      set (EditItemL.id) (new_id)
    )
