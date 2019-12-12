import { fmap } from "../../Data/Functor";
import { subscriptF } from "../../Data/List";
import { elem, isJust, Nothing } from "../../Data/Maybe";
import { fromDefault, Record } from "../../Data/Record";
import { fst, isTuple, snd } from "../../Data/Tuple";
import { CombatTechniqueId } from "../Constants/Ids";
import { EditItem } from "../Models/Hero/EditItem";
import { EditPrimaryAttributeDamageThreshold } from "../Models/Hero/EditPrimaryAttributeDamageThreshold";
import { pipe } from "./pipe";
import { isEmptyOr, isFloat, isInteger, isNaturalNumber } from "./RegexUtils";

export interface ItemEditorInputValidation {
  "@@name": "ItemEditorInputValidation"
  name: boolean
  amount: boolean
  at: boolean
  damageDiceNumber: boolean
  damageFlat: boolean
  firstDamageThreshold: boolean
  secondDamageThreshold: boolean
  damageThreshold: boolean
  enc: boolean
  ini: boolean
  length: boolean
  mov: boolean
  pa: boolean
  price: boolean
  pro: boolean
  range1: boolean
  range2: boolean
  range3: boolean
  stabilityMod: boolean
  weight: boolean

  melee: boolean
  ranged: boolean
  armor: boolean
  other: boolean
}

export const ItemEditorInputValidation =
  fromDefault ("ItemEditorInputValidation")
              <ItemEditorInputValidation> ({
                name: true,
                amount: true,
                at: true,
                damageDiceNumber: true,
                damageFlat: true,
                firstDamageThreshold: true,
                secondDamageThreshold: true,
                damageThreshold: true,
                enc: true,
                ini: true,
                length: true,
                mov: true,
                pa: true,
                price: true,
                pro: true,
                range1: true,
                range2: true,
                range3: true,
                stabilityMod: true,
                weight: true,

                melee: true,
                ranged: true,
                armor: true,
                other: true,
              })

const EIA = EditItem.A
const IEIVA = ItemEditorInputValidation.A
const EPADTA = EditPrimaryAttributeDamageThreshold.A

const validateRange = (index: 0 | 1 | 2) => pipe (
  EIA.range,
  subscriptF (index),
  fmap (isEmptyOr (isNaturalNumber)),
  elem<boolean> (true)
)

/**
 * Is the user input in item editor valid?
 *
 * Returns validation info for every input and combined validation for specific
 * item groups.
 */
export const validateItemEditorInput = (item: Record<EditItem>) => {
  const validName = EIA.name (item) .length > 0
  const validATMod = isInteger (EIA.at (item))
  const validDamageDiceNumber = isEmptyOr (isNaturalNumber) (EIA.damageDiceNumber (item))
  const validDamageFlat = isEmptyOr (isInteger) (EIA.damageFlat (item))

  const damageThreshold = EPADTA.threshold (EIA.damageBonus (item))

  const validFirstDamageThreshold =
    isTuple (damageThreshold)
    && isInteger (fst (damageThreshold))

  const validSecondDamageThreshold =
    isTuple (damageThreshold)
    && isInteger (snd (damageThreshold))

  const validDamageThreshold = isTuple (damageThreshold)
    ? isInteger (fst (damageThreshold)) && isInteger (snd (damageThreshold))
    : isInteger (damageThreshold)

  const validENC = isNaturalNumber (EIA.enc (item))
  const validINIMod = isEmptyOr (isInteger) (EIA.iniMod (item))
  const validLength = isEmptyOr (isNaturalNumber) (EIA.length (item))
  const validMOVMod = isEmptyOr (isInteger) (EIA.movMod (item))
  const validNumber = isEmptyOr (isNaturalNumber) (EIA.amount (item))
  const validPAMod = isInteger (EIA.pa (item))
  const validPrice = isEmptyOr (isFloat) (EIA.price (item))
  const validPRO = isNaturalNumber (EIA.pro (item))
  const validRange1 = validateRange (0) (item)
  const validRange2 = validateRange (1) (item)
  const validRange3 = validateRange (2) (item)
  const validStabilityMod = isEmptyOr (isInteger) (EIA.stabilityMod (item))
  const validWeight = isEmptyOr (isFloat) (EIA.weight (item))

  const validSingle = ItemEditorInputValidation ({
    name: validName,
    amount: validNumber,

    at: validATMod,
    damageDiceNumber: validDamageDiceNumber,
    damageFlat: validDamageFlat,
    firstDamageThreshold: validFirstDamageThreshold,
    secondDamageThreshold: validSecondDamageThreshold,
    damageThreshold: validDamageThreshold,
    enc: validENC,
    ini: validINIMod,
    length: validLength,
    mov: validMOVMod,
    pa: validPAMod,
    price: validPrice,
    pro: validPRO,
    range1: validRange1,
    range2: validRange2,
    range3: validRange3,
    stabilityMod: validStabilityMod,
    weight: validWeight,

    melee: Nothing,
    ranged: Nothing,
    armor: Nothing,
    other: Nothing,
  })

  const validMelee = validateMeleeWeaponInput (item) (validSingle)

  const validRanged = validateRangedWeaponInput (item) (validSingle)

  const validArmor = validateArmorInput (item) (validSingle)

  const validOther =
    validName
    && validNumber
    && validPrice
    && validWeight

  return ItemEditorInputValidation ({
    name: validName,
    amount: validNumber,

    at: validATMod,
    damageDiceNumber: validDamageDiceNumber,
    damageFlat: validDamageFlat,
    firstDamageThreshold: validFirstDamageThreshold,
    secondDamageThreshold: validSecondDamageThreshold,
    damageThreshold: validDamageThreshold,
    enc: validENC,
    ini: validINIMod,
    length: validLength,
    mov: validMOVMod,
    pa: validPAMod,
    price: validPrice,
    pro: validPRO,
    range1: validRange1,
    range2: validRange2,
    range3: validRange3,
    stabilityMod: validStabilityMod,
    weight: validWeight,

    melee: validMelee,
    ranged: validRanged,
    armor: validArmor,
    other: validOther,
  })
}

const validateMeleeWeaponInput =
  (item: Record<EditItem>) =>
  (validSingle: Record<ItemEditorInputValidation>) =>
    elem<string> (CombatTechniqueId.Lances) (EIA.combatTechnique (item))
    ? validateNoParryingWeapons (validSingle)
    : IEIVA.at (validSingle)
      && IEIVA.damageDiceNumber (validSingle)
      && IEIVA.damageFlat (validSingle)
      && IEIVA.damageThreshold (validSingle)
      && IEIVA.length (validSingle)
      && IEIVA.amount (validSingle)
      && IEIVA.pa (validSingle)
      && IEIVA.price (validSingle)
      && IEIVA.stabilityMod (validSingle)
      && IEIVA.weight (validSingle)
      && isJust (EIA.combatTechnique (item))
      && isJust (EIA.reach (item))

// Lances
const validateNoParryingWeapons =
  (validSingle: Record<ItemEditorInputValidation>) =>
    IEIVA.damageDiceNumber (validSingle)
    && IEIVA.damageFlat (validSingle)
    && IEIVA.length (validSingle)
    && IEIVA.amount (validSingle)
    && IEIVA.price (validSingle)
    && IEIVA.stabilityMod (validSingle)
    && IEIVA.weight (validSingle)

const validateRangedWeaponInput =
  (item: Record<EditItem>) =>
  (validSingle: Record<ItemEditorInputValidation>) =>
    IEIVA.damageDiceNumber (validSingle)
    && IEIVA.damageFlat (validSingle)
    && IEIVA.length (validSingle)
    && IEIVA.amount (validSingle)
    && IEIVA.price (validSingle)
    && IEIVA.range1 (validSingle)
    && IEIVA.range2 (validSingle)
    && IEIVA.range3 (validSingle)
    && IEIVA.stabilityMod (validSingle)
    && IEIVA.weight (validSingle)
    && isJust (EIA.combatTechnique (item))

const validateArmorInput =
  (item: Record<EditItem>) =>
  (validSingle: Record<ItemEditorInputValidation>) =>
    IEIVA.enc (validSingle)
    && IEIVA.ini (validSingle)
    && IEIVA.mov (validSingle)
    && IEIVA.amount (validSingle)
    && IEIVA.price (validSingle)
    && IEIVA.pro (validSingle)
    && IEIVA.stabilityMod (validSingle)
    && IEIVA.weight (validSingle)
    && isJust (EIA.armorType (item))
