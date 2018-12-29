import { pipe } from 'ramda';
import { EditItem, EditItemG } from './heroData/EditItem';
import { EditPrimaryAttributeDamageThresholdG } from './heroData/EditPrimaryAttributeDamageThreshold';
import { isEmptyOr, isFloat, isInteger, isNaturalNumber } from './RegexUtils';
import { all, index_, isList, List, subscript_ } from './structures/List';
import { elem, fmap, isJust, Nothing } from './structures/Maybe';
import { fromDefault, makeGetters, Record } from './structures/Record';

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

const ItemEditorInputValidationCreator =
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

export const ItemEditorInputValidationG = makeGetters (ItemEditorInputValidationCreator)

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
} = EditItemG

const { primary, threshold } = EditPrimaryAttributeDamageThresholdG

const validateRange = (index: 0 | 1 | 2) => pipe (
  range,
  subscript_ (index),
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
    && isInteger (index_ (damageThreshold) (0))

  const validSecondDamageThreshold =
    isList (damageThreshold)
    && List.length (damageThreshold) === 2
    && isInteger (index_ (damageThreshold) (1))

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

  const validSingle = ItemEditorInputValidationCreator ({
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

  return ItemEditorInputValidationCreator ({
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
    elem ('CT_7') (combatTechnique (item))
    ? validateNoParryingWeapons (validSingle)
    : ItemEditorInputValidationG.at (validSingle)
      && ItemEditorInputValidationG.damageDiceNumber (validSingle)
      && ItemEditorInputValidationG.damageFlat (validSingle)
      && ItemEditorInputValidationG.damageThreshold (validSingle)
      && ItemEditorInputValidationG.length (validSingle)
      && ItemEditorInputValidationG.amount (validSingle)
      && ItemEditorInputValidationG.pa (validSingle)
      && ItemEditorInputValidationG.price (validSingle)
      && ItemEditorInputValidationG.stabilityMod (validSingle)
      && ItemEditorInputValidationG.structurePoints (validSingle)
      && ItemEditorInputValidationG.weight (validSingle)
      && isJust (combatTechnique (item))
      && isJust (reach (item))

// Lances
const validateNoParryingWeapons =
  (validSingle: Record<ItemEditorInputValidation>) =>
    ItemEditorInputValidationG.damageDiceNumber (validSingle)
    && ItemEditorInputValidationG.damageFlat (validSingle)
    && ItemEditorInputValidationG.length (validSingle)
    && ItemEditorInputValidationG.amount (validSingle)
    && ItemEditorInputValidationG.price (validSingle)
    && ItemEditorInputValidationG.stabilityMod (validSingle)
    && ItemEditorInputValidationG.structurePoints (validSingle)
    && ItemEditorInputValidationG.weight (validSingle)

const validateRangedWeaponInput =
  (item: Record<EditItem>) =>
  (validSingle: Record<ItemEditorInputValidation>) =>
    ItemEditorInputValidationG.damageDiceNumber (validSingle)
    && ItemEditorInputValidationG.damageFlat (validSingle)
    && ItemEditorInputValidationG.length (validSingle)
    && ItemEditorInputValidationG.amount (validSingle)
    && ItemEditorInputValidationG.price (validSingle)
    && ItemEditorInputValidationG.range1 (validSingle)
    && ItemEditorInputValidationG.range2 (validSingle)
    && ItemEditorInputValidationG.range3 (validSingle)
    && ItemEditorInputValidationG.stabilityMod (validSingle)
    && ItemEditorInputValidationG.weight (validSingle)
    && isJust (combatTechnique (item))

const validateArmorInput =
  (item: Record<EditItem>) =>
  (validSingle: Record<ItemEditorInputValidation>) =>
    ItemEditorInputValidationG.enc (validSingle)
    && ItemEditorInputValidationG.ini (validSingle)
    && ItemEditorInputValidationG.mov (validSingle)
    && ItemEditorInputValidationG.amount (validSingle)
    && ItemEditorInputValidationG.price (validSingle)
    && ItemEditorInputValidationG.pro (validSingle)
    && ItemEditorInputValidationG.stabilityMod (validSingle)
    && ItemEditorInputValidationG.weight (validSingle)
    && isJust (armorType (item))
