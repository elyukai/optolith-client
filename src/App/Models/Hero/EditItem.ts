import { List } from "../../../Data/List";
import { Nothing } from "../../../Data/Maybe";
import { fromDefault } from "../../../Data/Record";
import { EditPrimaryAttributeDamageThreshold } from "./EditPrimaryAttributeDamageThreshold";
import { ItemEditorSpecific } from "./heroTypeHelpers";
import { ItemBase } from "./Item";

export interface EditItem extends ItemBase, ItemEditorSpecific { }

export const EditItem =
  fromDefault<EditItem> ({
    id: Nothing,
    name: "",
    ammunition: Nothing,
    combatTechnique: Nothing,
    damageDiceSides: Nothing,
    gr: 0,
    isParryingWeapon: Nothing,
    isTemplateLocked: false,
    reach: Nothing,
    template: Nothing,
    where: Nothing,
    isTwoHandedWeapon: Nothing,
    improvisedWeaponGroup: Nothing,
    loss: Nothing,
    forArmorZoneOnly: Nothing,
    addPenalties: Nothing,
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
