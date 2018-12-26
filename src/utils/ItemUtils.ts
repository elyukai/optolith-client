import { pipe } from 'ramda';
import { IdPrefixes } from '../constants/IdPrefixes';
import { EditPrimaryAttributeDamageThreshold, ItemEditorInstance, ItemInstance } from '../types/data';
import { PrimaryAttributeDamageThreshold } from '../types/wiki';
import { EditItemCreator, EditItemG } from './heroData/EditItemCreator';
import { EditPrimaryAttributeDamageThresholdCreator, EditPrimaryAttributeDamageThresholdG } from './heroData/EditPrimaryAttributeDamageThresholdCreator';
import { ItemCreator, ItemG } from './heroData/ItemCreator';
import { PrimaryAttributeDamageThresholdCreator, PrimaryAttributeDamageThresholdG } from './heroData/PrimaryAttributeDamageThresholdCreator';
import { prefixRawId } from './IDUtils';
import { ifElse } from './ifElse';
import { getLevelElementsWithZero } from './levelUtils';
import { gt } from './mathUtils';
import { not } from './not';
import { equals } from './structures/Eq';
import { all, fromArray, fromElements, isList, length, List, map } from './structures/List';
import { bind_, ensure, fmap, Just, mapMaybe, Maybe, maybe, Nothing, product, sum } from './structures/Maybe';
import { Record } from './structures/Record';
import { show } from './structures/Show';

const ifNumberOrEmpty = maybe<number, string> ('') (show)

const convertDamageBonusToEdit =
  maybe<Record<PrimaryAttributeDamageThreshold>, Record<EditPrimaryAttributeDamageThreshold>>
    (EditPrimaryAttributeDamageThresholdCreator ({
      threshold: '',
    }))
    (damageBonus => EditPrimaryAttributeDamageThresholdCreator ({
      primary: PrimaryAttributeDamageThresholdG.primary (damageBonus),
      threshold: ifElse<number | List<number>, List<number>, string | List<string>>
        (isList)
        (map (show))
        (show)
        (PrimaryAttributeDamageThresholdG.threshold (damageBonus)),
    }))

export const convertToEdit =
  (item: Record<ItemInstance>): Record<ItemEditorInstance> =>
    EditItemCreator ({
      id: Just (ItemG.id (item)),
      name: ItemG.name (item),
      ammunition: ItemG.ammunition (item),
      combatTechnique: ItemG.combatTechnique (item),
      damageDiceSides: ItemG.damageDiceSides (item),
      gr: ItemG.gr (item),
      isParryingWeapon: ItemG.isParryingWeapon (item),
      isTemplateLocked: ItemG.isTemplateLocked (item),
      reach: ItemG.reach (item),
      template: ItemG.template (item),
      where: ItemG.where (item),
      isTwoHandedWeapon: ItemG.isTwoHandedWeapon (item),
      improvisedWeaponGroup: ItemG.improvisedWeaponGroup (item),
      loss: ItemG.loss (item),
      forArmorZoneOnly: ItemG.forArmorZoneOnly (item),
      addPenalties: ItemG.addPenalties (item),
      armorType: ItemG.armorType (item),
      at: ifNumberOrEmpty (ItemG.at (item)),
      iniMod: ifNumberOrEmpty (ItemG.iniMod (item)),
      movMod: ifNumberOrEmpty (ItemG.movMod (item)),
      damageBonus: convertDamageBonusToEdit (ItemG.damageBonus (item)),
      damageDiceNumber: ifNumberOrEmpty (ItemG.damageDiceNumber (item)),
      damageFlat: ifNumberOrEmpty (ItemG.damageFlat (item)),
      enc: ifNumberOrEmpty (ItemG.enc (item)),
      length: ifNumberOrEmpty (ItemG.length (item)),
      amount: show (ItemG.amount (item)),
      pa: ifNumberOrEmpty (ItemG.pa (item)),
      price: show (ItemG.price (item)),
      pro: ifNumberOrEmpty (ItemG.pro (item)),
      range: maybe<List<number>, List<string>> (fromElements ('', '', ''))
                                              (map (show))
                                              (ItemG.range (item)),
      reloadTime: ifNumberOrEmpty (ItemG.reloadTime (item)),
      stp: ifNumberOrEmpty (ItemG.stp (item)),
      weight: show (ItemG.weight (item)),
      stabilityMod: ifNumberOrEmpty (ItemG.stabilityMod (item)),
    })

const isNotNaN = pipe (Number.isNaN, not)

const ensureIsNotNaN = bind_<number, number> (ensure (isNotNaN))

const toInt =
  (e: string): Maybe<number> =>
    e.length > 0 ? ensureIsNotNaN (Just (Number.parseInt (e.replace (/\,/, '.'), 10))) : Nothing

const toFloat =
  (e: string): Maybe<number> =>
    e.length > 0 ? ensureIsNotNaN (Just (Number.parseFloat (e.replace (/\,/, '.')))) : Nothing

const toMaybeIntGreaterThan =
  (int: number) => pipe (toInt, bind_<number, number> (ensure (gt (int))))

const toMaybeIntGreaterThan0 = toMaybeIntGreaterThan (0)
const toMaybeIntGreaterThan1 = toMaybeIntGreaterThan (1)

const convertDamageBonusToSave =
  (damageBonus: Record<EditPrimaryAttributeDamageThreshold>) =>
    ifElse<string | List<string>, List<string>, Maybe<Record<PrimaryAttributeDamageThreshold>>>
      (isList)
      (threshold => all<string> (e => e .length > 0) (threshold)
        ? Just (PrimaryAttributeDamageThresholdCreator ({
          primary: EditPrimaryAttributeDamageThresholdG.primary (damageBonus),
          threshold: mapMaybe<string, number> (toInt) (threshold),
        }))
        : Nothing)
      (threshold => threshold .length > 0
        ? fmap ((safeThreshold: number) => PrimaryAttributeDamageThresholdCreator ({
                 primary: EditPrimaryAttributeDamageThresholdG.primary (damageBonus),
                 threshold: safeThreshold,
               }))
               (toInt (threshold))
        : Nothing)
      (EditPrimaryAttributeDamageThresholdG.threshold (damageBonus))

export const convertToSave =
  (id: string) =>
  (item: Record<ItemEditorInstance>): Record<ItemInstance> =>
    ItemCreator ({
      id,
      name: EditItemG.name (item),
      ammunition: EditItemG.ammunition (item),
      combatTechnique: EditItemG.combatTechnique (item),
      damageDiceSides: EditItemG.damageDiceSides (item),
      gr: EditItemG.gr (item),
      isParryingWeapon: EditItemG.isParryingWeapon (item),
      isTemplateLocked: EditItemG.isTemplateLocked (item),
      reach: EditItemG.reach (item),
      template: EditItemG.template (item),
      where: EditItemG.where (item),
      isTwoHandedWeapon: EditItemG.isTwoHandedWeapon (item),
      improvisedWeaponGroup: EditItemG.improvisedWeaponGroup (item),
      loss: EditItemG.loss (item),
      forArmorZoneOnly: EditItemG.forArmorZoneOnly (item),
      addPenalties: EditItemG.addPenalties (item),
      armorType: EditItemG.armorType (item),
      at: toInt (EditItemG.at (item)),
      iniMod: toMaybeIntGreaterThan0 (EditItemG.iniMod (item)),
      movMod: toMaybeIntGreaterThan0 (EditItemG.movMod (item)),
      damageBonus: convertDamageBonusToSave (EditItemG.damageBonus (item)),
      damageDiceNumber: toInt (EditItemG.damageDiceNumber (item)),
      damageFlat: toInt (EditItemG.damageFlat (item)),
      enc: toInt (EditItemG.enc (item)),
      length: toFloat (EditItemG.length (item)),
      amount: product (toMaybeIntGreaterThan1 (EditItemG.amount (item))),
      pa: toInt (EditItemG.pa (item)),
      price: sum (toFloat (EditItemG.price (item))),
      pro: toInt (EditItemG.pro (item)),
      range: ensure<List<number>> (pipe (length, equals (3)))
                                  (mapMaybe (toInt) (EditItemG.range (item))),
      reloadTime: toInt (EditItemG.reloadTime (item)),
      stp: toInt (EditItemG.stp (item)),
      weight: sum (toFloat (EditItemG.weight (item))),
      stabilityMod: toInt (EditItemG.stabilityMod (item)),
    })

export const convertPrimaryAttributeToArray =
  (id: string): List<string> =>
    fromArray (id .split (/_/) .slice (1) .map (prefixRawId (IdPrefixes.ATTRIBUTES)))

export const getLossLevelElements = () => getLevelElementsWithZero (4)
