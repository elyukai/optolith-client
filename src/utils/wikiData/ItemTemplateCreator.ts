import { ItemTemplate } from '../../types/wiki';
import { List } from '../structures/List';
import { Nothing } from '../structures/Maybe';
import { fromDefault, makeGetters } from '../structures/Record';

export const ItemTemplateCreator =
  fromDefault<ItemTemplate> ({
    id: '',
    name: '',
    addPenalties: Nothing,
    ammunition: Nothing,
    amount: 1,
    armorType: Nothing,
    at: Nothing,
    combatTechnique: Nothing,
    damageBonus: Nothing,
    damageDiceNumber: Nothing,
    damageDiceSides: Nothing,
    damageFlat: Nothing,
    enc: Nothing,
    forArmorZoneOnly: Nothing,
    gr: 0,
    improvisedWeaponGroup: Nothing,
    iniMod: Nothing,
    isParryingWeapon: Nothing,
    isTemplateLocked: true,
    isTwoHandedWeapon: Nothing,
    length: Nothing,
    loss: Nothing,
    movMod: Nothing,
    pa: Nothing,
    price: Nothing,
    pro: Nothing,
    range: Nothing,
    reach: Nothing,
    reloadTime: Nothing,
    stabilityMod: Nothing,
    stp: Nothing,
    template: '',
    weight: Nothing,
    note: Nothing,
    rules: Nothing,
    advantage: Nothing,
    disadvantage: Nothing,
    src: List.empty,
  })

export const ItemTemplateG = makeGetters (ItemTemplateCreator)
