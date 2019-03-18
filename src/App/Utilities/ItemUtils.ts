import { pipe } from "ramda";
import { equals } from "../../Data/Eq";
import { fmap } from "../../Data/Functor";
import { all, flength, fromArray, isList, List, map } from "../../Data/List";
import { bindF, ensure, fromJust, Just, mapMaybe, Maybe, maybe, Nothing, product } from "../../Data/Maybe";
import { Record } from "../../Data/Record";
import { show } from "../../Data/Show";
import { IdPrefixes } from "../Constants/IdPrefixes";
import { EditHitZoneArmor, EditHitZoneArmorSafe } from "../Models/Hero/EditHitZoneArmor";
import { EditItem, EditItemSafe } from "../Models/Hero/EditItem";
import { EditPrimaryAttributeDamageThreshold } from "../Models/Hero/EditPrimaryAttributeDamageThreshold";
import { HitZoneArmor } from "../Models/Hero/HitZoneArmor";
import { Item } from "../Models/Hero/Item";
import { PrimaryAttributeDamageThreshold } from "../Models/Wiki/sub/PrimaryAttributeDamageThreshold";
import { prefixId } from "./IDUtils";
import { ifElse } from "./ifElse";
import { getLevelElementsWithZero } from "./levelUtils";
import { gt } from "./mathUtils";
import { toFloat, toInt } from "./NumberUtils";

const showMaybe = maybe ("") (show)

const primaryAttributeDamageThresholdToEditable =
  maybe
    (EditPrimaryAttributeDamageThreshold ({
      threshold: "",
    }))
    ((damageBonus: Record<PrimaryAttributeDamageThreshold>) =>
      EditPrimaryAttributeDamageThreshold ({
        primary: PrimaryAttributeDamageThreshold.A.primary (damageBonus),
        threshold: ifElse<number | List<number>, List<number>, string | List<string>>
          (isList)
          (map (show))
          (show)
          (PrimaryAttributeDamageThreshold.A.threshold (damageBonus)),
      }))

export const itemToEditable =
  (item: Record<Item>): Record<EditItem> =>
    EditItem ({
      id: Just (Item.A.id (item)),
      name: Item.A.name (item),
      ammunition: Item.A.ammunition (item),
      combatTechnique: Item.A.combatTechnique (item),
      damageDiceSides: Item.A.damageDiceSides (item),
      gr: Item.A.gr (item),
      isParryingWeapon: Item.A.isParryingWeapon (item),
      isTemplateLocked: Item.A.isTemplateLocked (item),
      reach: Item.A.reach (item),
      template: Item.A.template (item),
      where: Item.A.where (item),
      isTwoHandedWeapon: Item.A.isTwoHandedWeapon (item),
      improvisedWeaponGroup: Item.A.improvisedWeaponGroup (item),
      loss: Item.A.loss (item),
      forArmorZoneOnly: Item.A.forArmorZoneOnly (item),
      addPenalties: Item.A.addPenalties (item),
      armorType: Item.A.armorType (item),
      at: showMaybe (Item.A.at (item)),
      iniMod: showMaybe (Item.A.iniMod (item)),
      movMod: showMaybe (Item.A.movMod (item)),
      damageBonus: primaryAttributeDamageThresholdToEditable (Item.A.damageBonus (item)),
      damageDiceNumber: showMaybe (Item.A.damageDiceNumber (item)),
      damageFlat: showMaybe (Item.A.damageFlat (item)),
      enc: showMaybe (Item.A.enc (item)),
      length: showMaybe (Item.A.length (item)),
      amount: show (Item.A.amount (item)),
      pa: showMaybe (Item.A.pa (item)),
      price: show (Item.A.price (item)),
      pro: showMaybe (Item.A.pro (item)),
      range: maybe (List ("", "", ""))
                   (map<number, string> (show))
                   (Item.A.range (item)),
      reloadTime: showMaybe (Item.A.reloadTime (item)),
      stp: showMaybe (Item.A.stp (item)),
      weight: show (Item.A.weight (item)),
      stabilityMod: showMaybe (Item.A.stabilityMod (item)),
    })

const toMaybeIntGreaterThan =
  (int: number) => pipe (toInt, bindF<number, number> (ensure (gt (int))))

const toMaybeIntGreaterThan0 = toMaybeIntGreaterThan (0)
const toMaybeIntGreaterThan1 = toMaybeIntGreaterThan (1)

const editableToPrimaryAttributeDamageThreshold =
  (damageBonus: Record<EditPrimaryAttributeDamageThreshold>) =>
    ifElse<string | List<string>, List<string>, Maybe<Record<PrimaryAttributeDamageThreshold>>>
      (isList)
      (threshold => all<string> (e => e .length > 0) (threshold)
        ? Just (PrimaryAttributeDamageThreshold ({
          primary: EditPrimaryAttributeDamageThreshold.A.primary (damageBonus),
          threshold: mapMaybe<string, number> (toInt) (threshold),
        }))
        : Nothing)
      (threshold => threshold .length > 0
        ? fmap ((safeThreshold: number) => PrimaryAttributeDamageThreshold ({
                 primary: EditPrimaryAttributeDamageThreshold.A.primary (damageBonus),
                 threshold: safeThreshold,
               }))
               (toInt (threshold))
        : Nothing)
      (EditPrimaryAttributeDamageThreshold.A.threshold (damageBonus))

export const editableToItem =
  (item: Record<EditItemSafe>): Record<Item> =>
    Item ({
      id: fromJust (EditItem.A.id (item) as Just<string>),
      name: EditItem.A.name (item),
      ammunition: EditItem.A.ammunition (item),
      combatTechnique: EditItem.A.combatTechnique (item),
      damageDiceSides: EditItem.A.damageDiceSides (item),
      gr: EditItem.A.gr (item),
      isParryingWeapon: EditItem.A.isParryingWeapon (item),
      isTemplateLocked: EditItem.A.isTemplateLocked (item),
      reach: EditItem.A.reach (item),
      template: EditItem.A.template (item),
      where: EditItem.A.where (item),
      isTwoHandedWeapon: EditItem.A.isTwoHandedWeapon (item),
      improvisedWeaponGroup: EditItem.A.improvisedWeaponGroup (item),
      loss: EditItem.A.loss (item),
      forArmorZoneOnly: EditItem.A.forArmorZoneOnly (item),
      addPenalties: EditItem.A.addPenalties (item),
      armorType: EditItem.A.armorType (item),
      at: toInt (EditItem.A.at (item)),
      iniMod: toMaybeIntGreaterThan0 (EditItem.A.iniMod (item)),
      movMod: toMaybeIntGreaterThan0 (EditItem.A.movMod (item)),
      damageBonus: editableToPrimaryAttributeDamageThreshold (EditItem.A.damageBonus (item)),
      damageDiceNumber: toInt (EditItem.A.damageDiceNumber (item)),
      damageFlat: toInt (EditItem.A.damageFlat (item)),
      enc: toInt (EditItem.A.enc (item)),
      length: toFloat (EditItem.A.length (item)),
      amount: product (toMaybeIntGreaterThan1 (EditItem.A.amount (item))),
      pa: toInt (EditItem.A.pa (item)),
      price: toFloat (EditItem.A.price (item)),
      pro: toInt (EditItem.A.pro (item)),
      range: ensure<List<number>> (pipe (flength, equals (3)))
                                  (mapMaybe (toInt) (EditItem.A.range (item))),
      reloadTime: toInt (EditItem.A.reloadTime (item)),
      stp: toInt (EditItem.A.stp (item)),
      weight: toFloat (EditItem.A.weight (item)),
      stabilityMod: toInt (EditItem.A.stabilityMod (item)),
    })

export const convertPrimaryAttributeToArray =
  (id: string): List<string> =>
    fromArray (id .split (/_/) .slice (1) .map (prefixId (IdPrefixes.ATTRIBUTES)))

export const getLossLevelElements = () => getLevelElementsWithZero (4)

export const hitZoneArmorToEditable =
  (x: Record<HitZoneArmor>): Record<EditHitZoneArmor> =>
    EditHitZoneArmor ({
      id: Just (HitZoneArmor.A.id (x)),
      name: HitZoneArmor.A.name (x),
      head: HitZoneArmor.A.head (x),
      headLoss: HitZoneArmor.A.headLoss (x),
      leftArm: HitZoneArmor.A.leftArm (x),
      leftArmLoss: HitZoneArmor.A.leftArmLoss (x),
      leftLeg: HitZoneArmor.A.leftLeg (x),
      leftLegLoss: HitZoneArmor.A.leftLegLoss (x),
      rightArm: HitZoneArmor.A.rightArm (x),
      rightArmLoss: HitZoneArmor.A.rightArmLoss (x),
      rightLeg: HitZoneArmor.A.rightLeg (x),
      rightLegLoss: HitZoneArmor.A.rightLegLoss (x),
      torso: HitZoneArmor.A.torso (x),
      torsoLoss: HitZoneArmor.A.torsoLoss (x),
    })

export const editableToHitZoneArmor =
  (x: Record<EditHitZoneArmorSafe>): Record<HitZoneArmor> =>
    HitZoneArmor ({
      id: fromJust (EditHitZoneArmor.A.id (x) as Just<string>),
      name: HitZoneArmor.A.name (x),
      head: HitZoneArmor.A.head (x),
      headLoss: HitZoneArmor.A.headLoss (x),
      leftArm: HitZoneArmor.A.leftArm (x),
      leftArmLoss: HitZoneArmor.A.leftArmLoss (x),
      leftLeg: HitZoneArmor.A.leftLeg (x),
      leftLegLoss: HitZoneArmor.A.leftLegLoss (x),
      rightArm: HitZoneArmor.A.rightArm (x),
      rightArmLoss: HitZoneArmor.A.rightArmLoss (x),
      rightLeg: HitZoneArmor.A.rightLeg (x),
      rightLegLoss: HitZoneArmor.A.rightLegLoss (x),
      torso: HitZoneArmor.A.torso (x),
      torsoLoss: HitZoneArmor.A.torsoLoss (x),
    })
