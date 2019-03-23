import { List } from "../../../Data/List";
import { Just, Maybe, Nothing } from "../../../Data/Maybe";
import { elem, OrderedSet } from "../../../Data/OrderedSet";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { ItemTemplate } from "../Wiki/ItemTemplate";
import { PrimaryAttributeDamageThreshold } from "../Wiki/sub/PrimaryAttributeDamageThreshold";
import { SourceLink } from "../Wiki/sub/SourceLink";

export interface ItemBase {
  name: string
  ammunition: Maybe<string>
  combatTechnique: Maybe<string>
  damageDiceSides: Maybe<number>
  gr: number
  isParryingWeapon: boolean
  isTemplateLocked: boolean
  reach: Maybe<number>
  template: Maybe<string>
  where: Maybe<string>
  isTwoHandedWeapon: boolean
  improvisedWeaponGroup: Maybe<number>
  loss: Maybe<number>
  forArmorZoneOnly: boolean
  addPenalties: boolean
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
  weight: Maybe<number>
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
    weight: Nothing,
    stabilityMod: Nothing,
    note: Nothing,
    rules: Nothing,
    advantage: Nothing,
    disadvantage: Nothing,
    src: Nothing,
  })

export const ItemL = makeLenses (Item)

export const isItem =
  (x: Record<Item> | Record<ItemTemplate>): x is Record<Item> =>
    elem<keyof Item> ("where") (x .keys as OrderedSet<keyof Item>)

export const fromItemTemplate =
  (new_id: string) =>
  (x: Record<ItemTemplate>): Record<Item> =>
    Item ({
      id: new_id,
      name: ItemTemplate.A.name (x),
      ammunition: ItemTemplate.A.ammunition (x),
      combatTechnique: ItemTemplate.A.combatTechnique (x),
      damageDiceSides: ItemTemplate.A.damageDiceSides (x),
      gr: ItemTemplate.A.gr (x),
      isParryingWeapon: ItemTemplate.A.isParryingWeapon (x),
      isTemplateLocked: ItemTemplate.A.isTemplateLocked (x),
      reach: ItemTemplate.A.reach (x),
      template: Just (ItemTemplate.A.template (x)),
      where: Nothing,
      isTwoHandedWeapon: ItemTemplate.A.isTwoHandedWeapon (x),
      improvisedWeaponGroup: ItemTemplate.A.improvisedWeaponGroup (x),
      loss: ItemTemplate.A.loss (x),
      forArmorZoneOnly: ItemTemplate.A.forArmorZoneOnly (x),
      addPenalties: ItemTemplate.A.addPenalties (x),
      armorType: ItemTemplate.A.armorType (x),
      at: ItemTemplate.A.at (x),
      iniMod: ItemTemplate.A.iniMod (x),
      movMod: ItemTemplate.A.movMod (x),
      damageBonus: ItemTemplate.A.damageBonus (x),
      damageDiceNumber: ItemTemplate.A.damageDiceNumber (x),
      damageFlat: ItemTemplate.A.damageFlat (x),
      enc: ItemTemplate.A.enc (x),
      length: ItemTemplate.A.length (x),
      amount: ItemTemplate.A.amount (x),
      pa: ItemTemplate.A.pa (x),
      price: ItemTemplate.A.price (x),
      pro: ItemTemplate.A.pro (x),
      range: ItemTemplate.A.range (x),
      reloadTime: ItemTemplate.A.reloadTime (x),
      stp: ItemTemplate.A.stp (x),
      weight: ItemTemplate.A.weight (x),
      stabilityMod: ItemTemplate.A.stabilityMod (x),
      note: ItemTemplate.A.note (x),
      rules: ItemTemplate.A.rules (x),
      advantage: ItemTemplate.A.advantage (x),
      disadvantage: ItemTemplate.A.disadvantage (x),
      src: Just (ItemTemplate.A.src (x)),
    })
