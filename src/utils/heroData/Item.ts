import { List } from "../structures/List";
import { Maybe, Nothing } from "../structures/Maybe";
import { fromDefault, Record } from "../structures/Record";
import { PrimaryAttributeDamageThreshold } from "../wikiData/sub/PrimaryAttributeDamageThreshold";
import { SourceLink } from "../wikiData/sub/SourceLink";

export interface ItemBase {
  name: string
  ammunition: Maybe<string>
  combatTechnique: Maybe<string>
  damageDiceSides: Maybe<number>
  gr: number
  isParryingWeapon: Maybe<boolean>
  isTemplateLocked: boolean
  reach: Maybe<number>
  template: Maybe<string>
  where: Maybe<string>
  isTwoHandedWeapon: Maybe<boolean>
  improvisedWeaponGroup: Maybe<number>
  loss: Maybe<number>
  forArmorZoneOnly: Maybe<boolean>
  addPenalties: Maybe<boolean>
  armorType: Maybe<number>
}

export interface Item extends ItemBase {
  id: string
  at: Maybe<number>
  iniMod: Maybe<number>
  movMod: Maybe<number>
  damageBonus: Maybe<Record<PrimaryAttributeDamageThreshold>>
  damageDiceNumber: Maybe<number>
  damageFlat: Maybe<number>
  enc: Maybe<number>
  length: Maybe<number>
  amount: number
  pa: Maybe<number>
  price: Maybe<number>
  pro: Maybe<number>
  range: Maybe<List<number>>
  reloadTime: Maybe<number>
  stp: Maybe<number>
  weight: number
  stabilityMod: Maybe<number>
  note: Maybe<string>
  rules: Maybe<string>
  advantage: Maybe<string>
  disadvantage: Maybe<string>
  src: Maybe<List<Record<SourceLink>>>
}

export const Item =
  fromDefault<Item> ({
    id: "",
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
    at: Nothing,
    iniMod: Nothing,
    movMod: Nothing,
    damageBonus: Nothing,
    damageDiceNumber: Nothing,
    damageFlat: Nothing,
    enc: Nothing,
    length: Nothing,
    amount: 1,
    pa: Nothing,
    price: Nothing,
    pro: Nothing,
    range: Nothing,
    reloadTime: Nothing,
    stp: Nothing,
    weight: 0,
    stabilityMod: Nothing,
    note: Nothing,
    rules: Nothing,
    advantage: Nothing,
    disadvantage: Nothing,
    src: Nothing,
  })
