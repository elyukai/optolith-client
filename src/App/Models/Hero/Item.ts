import { assertNever } from "../../Utilities/Variant"
import { Item } from "../Hero.gen"
import { DropdownOption } from "../View/DropdownOption"
import { ItemTemplate } from "../Wiki/ItemTemplate"

export { Item }

const fromSpecial = (x: ItemTemplate["special"]): Item["special"] => {
  switch (x?.tag) {
    case "MundaneItem":
      return {
        tag: "MundaneItem",
        value: {
          structurePoints: x.value.structurePoints,
        },
      }

    case "MeleeWeapon":
      return {
        tag: "MeleeWeapon",
        value: {
          combatTechnique: x.value.combatTechnique,
          damage: x.value.damage,
          primaryAttributeDamageThreshold: x.value.primaryAttributeDamageThreshold,
          at: x.value.at,
          pa: x.value.pa,
          reach: x.value.reach,
          length: x.value.length,
          structurePoints: x.value.structurePoints,
          isParryingWeapon: x.value.isParryingWeapon,
          isTwoHandedWeapon: x.value.isTwoHandedWeapon,
          isImprovisedWeapon: x.value.isImprovisedWeapon,
        },
      }

    case "RangedWeapon":
      return {
        tag: "RangedWeapon",
        value: {
          combatTechnique: x.value.combatTechnique,
          damage: x.value.damage,
          length: x.value.length,
          range: x.value.range,
          reloadTime: x.value.reloadTime,
          ammunition: x.value.ammunition,
          isImprovisedWeapon: x.value.isImprovisedWeapon,
        },
      }

    case "CombinedWeapon":
      return {
        tag: "CombinedWeapon",
        value: [
          {
            combatTechnique: x.value[0].combatTechnique,
            damage: x.value[0].damage,
            primaryAttributeDamageThreshold: x.value[0].primaryAttributeDamageThreshold,
            at: x.value[0].at,
            pa: x.value[0].pa,
            reach: x.value[0].reach,
            length: x.value[0].length,
            structurePoints: x.value[0].structurePoints,
            isParryingWeapon: x.value[0].isParryingWeapon,
            isTwoHandedWeapon: x.value[0].isTwoHandedWeapon,
            isImprovisedWeapon: x.value[0].isImprovisedWeapon,
          },
          {
            combatTechnique: x.value[1].combatTechnique,
            damage: x.value[1].damage,
            length: x.value[1].length,
            range: x.value[1].range,
            reloadTime: x.value[1].reloadTime,
            ammunition: x.value[1].ammunition,
            isImprovisedWeapon: x.value[1].isImprovisedWeapon,
          },
        ],
      }

    case "Armor":
      return {
        tag: "Armor",
        value: {
          protection: x.value.protection,
          encumbrance: x.value.encumbrance,
          hasAdditionalPenalties: x.value.hasAdditionalPenalties,
          armorType: x.value.armorType,
        },
      }

    case undefined:
      return undefined

    default:
      return assertNever (x?.tag as never)
  }
}

export const fromItemTemplate =
  (new_id: number) =>
  (x: ItemTemplate): Item =>
    ({
      id: new_id,
      name: x.name,
      price: x.price,
      weight: x.weight,
      special: fromSpecial (x.special),
      gr: x.gr,
      isTemplateLocked: true,
      template: x.id,
    })

export const itemToDropdown =
  (x: Item): DropdownOption<number> => ({ id: x.id, name: x.name })
