import { equals } from "../../Data/Eq"
import { fmap } from "../../Data/Functor"
import { set } from "../../Data/Lens"
import { flength, fromArray, List, map, notNullStr } from "../../Data/List"
import { bindF, ensure, fromJust, Just, liftM2, mapMaybe, Maybe, maybe, Nothing, product } from "../../Data/Maybe"
import { gt } from "../../Data/Num"
import { Record } from "../../Data/Record"
import { show } from "../../Data/Show"
import { bimap, fst, isTuple, Pair, snd } from "../../Data/Tuple"
import { IdPrefixes } from "../Constants/IdPrefixes"
import { EditHitZoneArmor, EditHitZoneArmorSafe } from "../Models/Hero/EditHitZoneArmor"
import { EditItem, EditItemL, EditItemSafe } from "../Models/Hero/EditItem"
import { EditPrimaryAttributeDamageThreshold } from "../Models/Hero/EditPrimaryAttributeDamageThreshold"
import { HitZoneArmor } from "../Models/Hero/HitZoneArmor"
import { fromItemTemplate, Item } from "../Models/Hero/Item"
import { PrimaryAttributeDamageThreshold } from "../Models/Wiki/sub/PrimaryAttributeDamageThreshold"
import { prefixId } from "./IDUtils"
import { ifElse } from "./ifElse"
import { getLevelElementsWithZero } from "./levelUtils"
import { toFloat, toInt } from "./NumberUtils"
import { pipe } from "./pipe"

const showMaybe = maybe ("") (show)

const primaryAttributeDamageThresholdToEditable =
  maybe
    (EditPrimaryAttributeDamageThreshold ({
      threshold: "",
    }))
    ((damageBonus: Record<PrimaryAttributeDamageThreshold>) =>
      EditPrimaryAttributeDamageThreshold ({
        primary: PrimaryAttributeDamageThreshold.AL.primary (damageBonus),
        threshold: ifElse<number | Pair<number, number>, Pair<number, number>>
          (isTuple)
          <string | Pair<string, string>>
          (bimap (show) (show))
          (show)
          (PrimaryAttributeDamageThreshold.AL.threshold (damageBonus)),
      }))

export const itemToEditable =
  (item: Record<Item>): Record<EditItem> =>
    EditItem ({
      id: Just (Item.AL.id (item)),
      name: Item.AL.name (item),
      ammunition: Item.AL.ammunition (item),
      combatTechnique: Item.AL.combatTechnique (item),
      damageDiceSides: Item.AL.damageDiceSides (item),
      gr: Item.AL.gr (item),
      isParryingWeapon: Item.AL.isParryingWeapon (item),
      isTemplateLocked: Item.AL.isTemplateLocked (item),
      reach: Item.AL.reach (item),
      template: Item.AL.template (item),
      where: Item.AL.where (item),
      isTwoHandedWeapon: Item.AL.isTwoHandedWeapon (item),
      improvisedWeaponGroup: Item.AL.improvisedWeaponGroup (item),
      loss: Item.AL.loss (item),
      forArmorZoneOnly: Item.AL.forArmorZoneOnly (item),
      addPenalties: Item.AL.addPenalties (item),
      armorType: Item.AL.armorType (item),
      at: showMaybe (Item.AL.at (item)),
      iniMod: showMaybe (Item.AL.iniMod (item)),
      movMod: showMaybe (Item.AL.movMod (item)),
      damageBonus: primaryAttributeDamageThresholdToEditable (Item.AL.damageBonus (item)),
      damageDiceNumber: showMaybe (Item.AL.damageDiceNumber (item)),
      damageFlat: showMaybe (Item.AL.damageFlat (item)),
      enc: showMaybe (Item.AL.enc (item)),
      length: showMaybe (Item.AL.length (item)),
      amount: show (Item.AL.amount (item)),
      pa: showMaybe (Item.AL.pa (item)),
      price: showMaybe (Item.AL.price (item)),
      pro: showMaybe (Item.AL.pro (item)),
      range: maybe (List ("", "", ""))
                   (map<number, string> (show))
                   (Item.AL.range (item)),
      reloadTime: showMaybe (Item.AL.reloadTime (item)),
      stp: showMaybe (Item.AL.stp (item)),
      weight: showMaybe (Item.AL.weight (item)),
      stabilityMod: showMaybe (Item.AL.stabilityMod (item)),
    })

const toMaybeIntGreaterThan =
  (int: number) => pipe (toInt, bindF<number, number> (ensure (gt (int))))

const toMaybeIntGreaterThan0 = toMaybeIntGreaterThan (0)
const toMaybeIntGreaterThan1 = toMaybeIntGreaterThan (1)

const editableToPrimaryAttributeDamageThreshold =
  (damageBonus: Record<EditPrimaryAttributeDamageThreshold>) =>
    ifElse<string | Pair<string, string>, Pair<string, string>>
      (isTuple)
      (threshold => {
        const mfst_th = toInt (fst (threshold))
        const msnd_th = toInt (snd (threshold))

        return liftM2 ((fst_th: number) => (snd_th: number) =>
                        PrimaryAttributeDamageThreshold ({
                          primary: EditPrimaryAttributeDamageThreshold.AL.primary (damageBonus),
                          threshold: Pair (fst_th, snd_th),
                        }))
                      (mfst_th)
                      (msnd_th)
      })
      (threshold => threshold .length > 0
        ? fmap ((safeThreshold: number) => PrimaryAttributeDamageThreshold ({
                 primary: EditPrimaryAttributeDamageThreshold.AL.primary (damageBonus),
                 threshold: safeThreshold,
               }))
               (toInt (threshold))
        : Nothing)
      (EditPrimaryAttributeDamageThreshold.AL.threshold (damageBonus))

export const editableToItem =
  (item: Record<EditItemSafe>): Record<Item> =>
    Item ({
      id: fromJust (EditItem.AL.id (item) as Just<string>),
      name: EditItem.AL.name (item),
      ammunition: EditItem.AL.ammunition (item),
      combatTechnique: EditItem.AL.combatTechnique (item),
      damageDiceSides: EditItem.AL.damageDiceSides (item),
      gr: EditItem.AL.gr (item),
      isParryingWeapon: EditItem.AL.isParryingWeapon (item),
      isTemplateLocked: EditItem.AL.isTemplateLocked (item),
      reach: EditItem.AL.reach (item),
      template: EditItem.AL.template (item),
      where: EditItem.AL.where (item),
      isTwoHandedWeapon: EditItem.AL.isTwoHandedWeapon (item),
      improvisedWeaponGroup: EditItem.AL.improvisedWeaponGroup (item),
      loss: EditItem.AL.loss (item),
      forArmorZoneOnly: EditItem.AL.forArmorZoneOnly (item),
      addPenalties: EditItem.AL.addPenalties (item),
      armorType: EditItem.AL.armorType (item),
      at: toInt (EditItem.AL.at (item)),
      iniMod: toMaybeIntGreaterThan0 (EditItem.AL.iniMod (item)),
      movMod: toMaybeIntGreaterThan0 (EditItem.AL.movMod (item)),
      damageBonus: editableToPrimaryAttributeDamageThreshold (EditItem.AL.damageBonus (item)),
      damageDiceNumber: toInt (EditItem.AL.damageDiceNumber (item)),
      damageFlat: toInt (EditItem.AL.damageFlat (item)),
      enc: toInt (EditItem.AL.enc (item)),
      length: toFloat (EditItem.AL.length (item)),
      amount: product (toMaybeIntGreaterThan1 (EditItem.AL.amount (item))),
      pa: toInt (EditItem.AL.pa (item)),
      price: toFloat (EditItem.AL.price (item)),
      pro: toInt (EditItem.AL.pro (item)),
      range: ensure<List<number>> (pipe (flength, equals (3)))
                                  (mapMaybe (toInt) (EditItem.AL.range (item))),
      reloadTime: ensure (notNullStr) (EditItem.AL.reloadTime (item)),
      stp: ensure (notNullStr) (EditItem.AL.stp (item)),
      weight: toFloat (EditItem.AL.weight (item)),
      stabilityMod: toInt (EditItem.AL.stabilityMod (item)),
    })

export const convertPrimaryAttributeToArray =
  (id: string): List<string> =>
    fromArray (id .split (/_/u) .slice (1)
.map (prefixId (IdPrefixes.ATTRIBUTES)))

export const getLossLevelElements = () => getLevelElementsWithZero (4)

export const hitZoneArmorToEditable =
  (x: Record<HitZoneArmor>): Record<EditHitZoneArmor> =>
    EditHitZoneArmor ({
      id: Just (HitZoneArmor.AL.id (x)),
      name: HitZoneArmor.AL.name (x),
      head: HitZoneArmor.AL.head (x),
      headLoss: HitZoneArmor.AL.headLoss (x),
      leftArm: HitZoneArmor.AL.leftArm (x),
      leftArmLoss: HitZoneArmor.AL.leftArmLoss (x),
      leftLeg: HitZoneArmor.AL.leftLeg (x),
      leftLegLoss: HitZoneArmor.AL.leftLegLoss (x),
      rightArm: HitZoneArmor.AL.rightArm (x),
      rightArmLoss: HitZoneArmor.AL.rightArmLoss (x),
      rightLeg: HitZoneArmor.AL.rightLeg (x),
      rightLegLoss: HitZoneArmor.AL.rightLegLoss (x),
      torso: HitZoneArmor.AL.torso (x),
      torsoLoss: HitZoneArmor.AL.torsoLoss (x),
    })

export const editableToHitZoneArmor =
  (x: Record<EditHitZoneArmorSafe>): Record<HitZoneArmor> =>
    HitZoneArmor ({
      id: fromJust (EditHitZoneArmor.AL.id (x) as Just<string>),
      name: HitZoneArmor.AL.name (x),
      head: HitZoneArmor.AL.head (x),
      headLoss: HitZoneArmor.AL.headLoss (x),
      leftArm: HitZoneArmor.AL.leftArm (x),
      leftArmLoss: HitZoneArmor.AL.leftArmLoss (x),
      leftLeg: HitZoneArmor.AL.leftLeg (x),
      leftLegLoss: HitZoneArmor.AL.leftLegLoss (x),
      rightArm: HitZoneArmor.AL.rightArm (x),
      rightArmLoss: HitZoneArmor.AL.rightArmLoss (x),
      rightLeg: HitZoneArmor.AL.rightLeg (x),
      rightLegLoss: HitZoneArmor.AL.rightLegLoss (x),
      torso: HitZoneArmor.AL.torso (x),
      torsoLoss: HitZoneArmor.AL.torsoLoss (x),
    })

export const fromItemTemplateEdit =
  (new_id: Maybe<string>) =>
    pipe (
      fromItemTemplate (""),
      itemToEditable,
      set (EditItemL.id) (new_id)
    )
