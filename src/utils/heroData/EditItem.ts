import { ItemEditorSpecific } from '../../types/data';
import { fromElements } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';
import { EditPrimaryAttributeDamageThreshold } from './EditPrimaryAttributeDamageThreshold';
import { ItemBase } from './Item';

export interface EditItem extends ItemBase, ItemEditorSpecific { }

export const EditItem =
  fromDefault<EditItem> ({
    id: Nothing,
    name: '',
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
    at: '',
    iniMod: '',
    movMod: '',
    damageBonus: EditPrimaryAttributeDamageThreshold .default,
    damageDiceNumber: '',
    damageFlat: '',
    enc: '',
    length: '',
    amount: '',
    pa: '',
    price: '',
    pro: '',
    range: fromElements ('', '', ''),
    reloadTime: '',
    stp: '',
    weight: '',
    stabilityMod: '',
  })

export const EditItemG = makeGetters (EditItem)
