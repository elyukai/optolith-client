import { List } from "../../../Data/List";
import { Just, Maybe, Nothing } from "../../../Data/Maybe";
import { fromDefault, Record } from "../../../Data/Record";
import { DropdownOption } from "../../Views/Universal/Dropdown";
import { PrimaryAttributeDamageThreshold } from "./sub/PrimaryAttributeDamageThreshold";
import { SourceLink } from "./sub/SourceLink";

export interface ItemTemplate {
  "@@name": "ItemTemplate"
  id: string
  name: string
  addPenalties: boolean
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
  forArmorZoneOnly: boolean
  gr: number
  improvisedWeaponGroup: Maybe<number>
  iniMod: Maybe<number>
  isParryingWeapon: boolean
  isTemplateLocked: boolean
  isTwoHandedWeapon: boolean
  length: Maybe<number>
  loss: Maybe<number>
  movMod: Maybe<number>
  pa: Maybe<number>
  price: Maybe<number>
  pro: Maybe<number>
  range: Maybe<List<number>>
  reach: Maybe<number>
  reloadTime: Maybe<string>
  stabilityMod: Maybe<number>
  stp: Maybe<string>
  template: string
  weight: Maybe<number>
  note: Maybe<string>
  rules: Maybe<string>
  advantage: Maybe<string>
  disadvantage: Maybe<string>
  src: List<Record<SourceLink>>
}

export const ItemTemplate =
  fromDefault ("ItemTemplate")
              <ItemTemplate> ({
                id: "",
                name: "",
                addPenalties: false,
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
                forArmorZoneOnly: false,
                gr: 0,
                improvisedWeaponGroup: Nothing,
                iniMod: Nothing,
                isParryingWeapon: false,
                isTemplateLocked: true,
                isTwoHandedWeapon: false,
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
                template: "",
                weight: Nothing,
                note: Nothing,
                rules: Nothing,
                advantage: Nothing,
                disadvantage: Nothing,
                src: List.empty,
              })

const ITA = ItemTemplate.A

export const itemTemplateToDropdown =
  (x: Record<ItemTemplate>) => DropdownOption ({ id: Just (ITA.id (x)), name: ITA.name (x) })
