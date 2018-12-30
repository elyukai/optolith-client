import { List } from '../structures/List';
import { Maybe, Nothing } from '../structures/Maybe';
import { fromDefault, Record } from '../structures/Record';
import { PrimaryAttributeDamageThreshold } from './sub/PrimaryAttributeDamageThreshold';
import { SourceLink } from './sub/SourceLink';

export interface ItemTemplate {
  id: string
  name: string
  addPenalties: Maybe<boolean>
  ammunition: Maybe<string>
  amount: number
  armorType: Maybe<number>
  at: Maybe<number>
  combatTechnique: Maybe<string>
  damageBonus: Maybe<Record<PrimaryAttributeDamageThreshold>>
  damageDiceNumber: Maybe<number>
  damageDiceSides: Maybe<number>
  damageFlat: Maybe<number>
  enc: Maybe<number>
  forArmorZoneOnly: Maybe<boolean>
  gr: number
  improvisedWeaponGroup: Maybe<number>
  iniMod: Maybe<number>
  isParryingWeapon: Maybe<boolean>
  isTemplateLocked: boolean
  isTwoHandedWeapon: Maybe<boolean>
  length: Maybe<number>
  loss: Maybe<number>
  movMod: Maybe<number>
  pa: Maybe<number>
  price: Maybe<number>
  pro: Maybe<number>
  range: Maybe<List<number>>
  reach: Maybe<number>
  reloadTime: Maybe<number>
  stabilityMod: Maybe<number>
  stp: Maybe<number>
  template: string
  weight: Maybe<number>
  note: Maybe<string>
  rules: Maybe<string>
  advantage: Maybe<string>
  disadvantage: Maybe<string>
  src: List<Record<SourceLink>>
}

export const ItemTemplate =
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
