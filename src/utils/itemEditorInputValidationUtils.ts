import { pipe } from "ramda";
import { EditItem } from "./heroData/EditItem";
import { EditPrimaryAttributeDamageThreshold } from "./heroData/EditPrimaryAttributeDamageThreshold";
import { isEmptyOr, isFloat, isInteger, isNaturalNumber } from "./RegexUtils";
import { all, isList, List, subscriptF, unsafeIndex } from "./structures/List";
import { elem, fmap, isJust, Nothing } from "./structures/Maybe";
import { fromDefault, Record } from "./structures/Record";

export interface ItemEditorInputValidation {
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
  structurePoints: boolean
  weight: boolean

  melee: boolean
  ranged: boolean
  armor: boolean
  other: boolean
}

export const ItemEditorInputValidation =
  fromDefault<ItemEditorInputValidation> ({
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
    structurePoints: true,
    weight: true,

    melee: true,
    ranged: true,
    armor: true,
    other: true,
  })

const {
  name,
  combatTechnique,
  reach,
  armorType,
  at,
  iniMod,
  movMod,
  damageBonus,
  damageDiceNumber,
  damageFlat,
  enc,
  length,
  amount,
  pa,
  price,
  pro,
  range,
  stp,
  weight,
  stabilityMod,
} = EditItem.A

const { primary, threshold } = EditPrimaryAttributeDamageThreshold.A

const validateRange = (index: 0 | 1 | 2) => pipe (
  range,
  subscriptF (index),
  fmap (isEmptyOr (isNaturalNumber)),
  elem (true)
)

/**
 * Is the user input in item editor valid?
 *
 * Returns validation info for every input and combined validation for specific
 * item groups.
 */
export const validateItemEditorInput = (item: Record<EditItem>) => {
  const validName = name (item) .length > 0
  const validATMod = isInteger (at (item))
  const validDamageDiceNumber = isEmptyOr (isNaturalNumber) (damageDiceNumber (item))
  const validDamageFlat = isEmptyOr (isInteger) (damageFlat (item))

  const primaryAttribute = primary (damageBonus (item))
  const damageThreshold = threshold (damageBonus (item))

  const validPrimaryAttribute = isJust (primaryAttribute)

  const validFirstDamageThreshold =
    isList (damageThreshold)
    && List.length (damageThreshold) === 2
    && isInteger (unsafeIndex (damageThreshold) (0))

  const validSecondDamageThreshold =
    isList (damageThreshold)
    && List.length (damageThreshold) === 2
    && isInteger (unsafeIndex (damageThreshold) (1))

  const validDamageThreshold = isList (damageThreshold)
    ? List.length (damageThreshold) === 2 && all (isInteger) (damageThreshold)
    : isInteger (damageThreshold)

  const validPrimaryAttributeDamageThreshold = validPrimaryAttribute && validDamageThreshold

  const validENC = isNaturalNumber (enc (item))
  const validINIMod = isEmptyOr (isInteger) (iniMod (item))
  const validLength = isEmptyOr (isNaturalNumber) (length (item))
  const validMOVMod = isEmptyOr (isInteger) (movMod (item))
  const validNumber = isEmptyOr (isNaturalNumber) (amount (item))
  const validPAMod = isInteger (pa (item))
  const validPrice = isEmptyOr (isFloat) (price (item))
  const validPRO = isNaturalNumber (pro (item))
  const validRange1 = validateRange (0) (item)
  const validRange2 = validateRange (1) (item)
  const validRange3 = validateRange (2) (item)
  const validStabilityMod = isEmptyOr (isInteger) (stabilityMod (item))
  const validStructurePoints = isEmptyOr (isNaturalNumber) (stp (item))
  const validWeight = isEmptyOr (isFloat) (weight (item))

  const validSingle = ItemEditorInputValidation ({
    name: validName,
    amount: validNumber,

    at: validATMod,
    damageDiceNumber: validDamageDiceNumber,
    damageFlat: validDamageFlat,
    firstDamageThreshold: validFirstDamageThreshold,
    secondDamageThreshold: validSecondDamageThreshold,
    damageThreshold: validPrimaryAttributeDamageThreshold,
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
    structurePoints: validStructurePoints,
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
    && validStructurePoints
    && validWeight

  return ItemEditorInputValidation ({
    name: validName,
    amount: validNumber,

    at: validATMod,
    damageDiceNumber: validDamageDiceNumber,
    damageFlat: validDamageFlat,
    firstDamageThreshold: validFirstDamageThreshold,
    secondDamageThreshold: validSecondDamageThreshold,
    damageThreshold: validPrimaryAttributeDamageThreshold,
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
    structurePoints: validStructurePoints,
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
    elem ("CT_7") (combatTechnique (item))
    ? validateNoParryingWeapons (validSingle)
    : ItemEditorInputValidation.A.at (validSingle)
      && ItemEditorInputValidation.A.damageDiceNumber (validSingle)
      && ItemEditorInputValidation.A.damageFlat (validSingle)
      && ItemEditorInputValidation.A.damageThreshold (validSingle)
      && ItemEditorInputValidation.A.length (validSingle)
      && ItemEditorInputValidation.A.amount (validSingle)
      && ItemEditorInputValidation.A.pa (validSingle)
      && ItemEditorInputValidation.A.price (validSingle)
      && ItemEditorInputValidation.A.stabilityMod (validSingle)
      && ItemEditorInputValidation.A.structurePoints (validSingle)
      && ItemEditorInputValidation.A.weight (validSingle)
      && isJust (combatTechnique (item))
      && isJust (reach (item))

// Lances
const validateNoParryingWeapons =
  (validSingle: Record<ItemEditorInputValidation>) =>
    ItemEditorInputValidation.A.damageDiceNumber (validSingle)
    && ItemEditorInputValidation.A.damageFlat (validSingle)
    && ItemEditorInputValidation.A.length (validSingle)
    && ItemEditorInputValidation.A.amount (validSingle)
    && ItemEditorInputValidation.A.price (validSingle)
    && ItemEditorInputValidation.A.stabilityMod (validSingle)
    && ItemEditorInputValidation.A.structurePoints (validSingle)
    && ItemEditorInputValidation.A.weight (validSingle)

const validateRangedWeaponInput =
  (item: Record<EditItem>) =>
  (validSingle: Record<ItemEditorInputValidation>) =>
    ItemEditorInputValidation.A.damageDiceNumber (validSingle)
    && ItemEditorInputValidation.A.damageFlat (validSingle)
    && ItemEditorInputValidation.A.length (validSingle)
    && ItemEditorInputValidation.A.amount (validSingle)
    && ItemEditorInputValidation.A.price (validSingle)
    && ItemEditorInputValidation.A.range1 (validSingle)
    && ItemEditorInputValidation.A.range2 (validSingle)
    && ItemEditorInputValidation.A.range3 (validSingle)
    && ItemEditorInputValidation.A.stabilityMod (validSingle)
    && ItemEditorInputValidation.A.weight (validSingle)
    && isJust (combatTechnique (item))

const validateArmorInput =
  (item: Record<EditItem>) =>
  (validSingle: Record<ItemEditorInputValidation>) =>
    ItemEditorInputValidation.A.enc (validSingle)
    && ItemEditorInputValidation.A.ini (validSingle)
    && ItemEditorInputValidation.A.mov (validSingle)
    && ItemEditorInputValidation.A.amount (validSingle)
    && ItemEditorInputValidation.A.price (validSingle)
    && ItemEditorInputValidation.A.pro (validSingle)
    && ItemEditorInputValidation.A.stabilityMod (validSingle)
    && ItemEditorInputValidation.A.weight (validSingle)
    && isJust (armorType (item))
