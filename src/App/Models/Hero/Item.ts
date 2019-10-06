import { List } from "../../../Data/List";
import { Just, Maybe, Nothing } from "../../../Data/Maybe";
import { elem, OrderedSet } from "../../../Data/OrderedSet";
import { fromDefault, makeLenses, Record } from "../../../Data/Record";
import { DropdownOption } from "../../Views/Universal/Dropdown";
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
  "@@name": "Item"
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
  reloadTime: Maybe<string>
  stp: Maybe<string>
  weight: Maybe<number>
  stabilityMod: Maybe<number>
  note: Maybe<string>
  rules: Maybe<string>
  advantage: Maybe<string>
  disadvantage: Maybe<string>
  src: Maybe<List<Record<SourceLink>>>
}

export const Item =
  fromDefault ("Item")
              <Item> ({
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
      name: ItemTemplate.AL.name (x),
      ammunition: ItemTemplate.AL.ammunition (x),
      combatTechnique: ItemTemplate.AL.combatTechnique (x),
      damageDiceSides: ItemTemplate.AL.damageDiceSides (x),
      gr: ItemTemplate.AL.gr (x),
      isParryingWeapon: ItemTemplate.AL.isParryingWeapon (x),
      isTemplateLocked: ItemTemplate.AL.isTemplateLocked (x),
      reach: ItemTemplate.AL.reach (x),
      template: Just (ItemTemplate.AL.template (x)),
      where: Nothing,
      isTwoHandedWeapon: ItemTemplate.AL.isTwoHandedWeapon (x),
      improvisedWeaponGroup: ItemTemplate.AL.improvisedWeaponGroup (x),
      loss: ItemTemplate.AL.loss (x),
      forArmorZoneOnly: ItemTemplate.AL.forArmorZoneOnly (x),
      addPenalties: ItemTemplate.AL.addPenalties (x),
      armorType: ItemTemplate.AL.armorType (x),
      at: ItemTemplate.AL.at (x),
      iniMod: ItemTemplate.AL.iniMod (x),
      movMod: ItemTemplate.AL.movMod (x),
      damageBonus: ItemTemplate.AL.damageBonus (x),
      damageDiceNumber: ItemTemplate.AL.damageDiceNumber (x),
      damageFlat: ItemTemplate.AL.damageFlat (x),
      enc: ItemTemplate.AL.enc (x),
      length: ItemTemplate.AL.length (x),
      amount: ItemTemplate.AL.amount (x),
      pa: ItemTemplate.AL.pa (x),
      price: ItemTemplate.AL.price (x),
      pro: ItemTemplate.AL.pro (x),
      range: ItemTemplate.AL.range (x),
      reloadTime: ItemTemplate.AL.reloadTime (x),
      stp: ItemTemplate.AL.stp (x),
      weight: ItemTemplate.AL.weight (x),
      stabilityMod: ItemTemplate.AL.stabilityMod (x),
      note: ItemTemplate.AL.note (x),
      rules: ItemTemplate.AL.rules (x),
      advantage: ItemTemplate.AL.advantage (x),
      disadvantage: ItemTemplate.AL.disadvantage (x),
      src: Just (ItemTemplate.AL.src (x)),
    })

export const itemToDropdown =
  (x: Record<Item>) => DropdownOption ({ id: Just (Item.A.id (x)), name: Item.A.name (x) })
