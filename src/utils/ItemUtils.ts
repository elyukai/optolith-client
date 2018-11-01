import * as R from 'ramda';
import { ItemEditorInstance, ItemEditorSpecific, ItemInstance } from '../types/data';
import { Just, List, Maybe, Nothing, Record } from './dataUtils';
import { getLevelElementsWithZero } from './levelUtils';
import { isEmptyOr, isFloat, isInteger, isNaturalNumber } from './RegexUtils';

const ifNumberOrEmpty = Maybe.maybe<number, string> ('') (x => x.toString ());

type DamageBonus = ItemInstance['damageBonus'];
type DamageBonusEditor = ItemEditorInstance['damageBonus'];

const convertDamageBonusToEdit =
  (maybeDamageBonus: Maybe<NonNullable<DamageBonus>>): DamageBonusEditor => {
    if (Maybe.isJust (maybeDamageBonus)) {
      const damageBonus = Maybe.fromJust (maybeDamageBonus);

      const threshold = damageBonus.get ('threshold');

      return damageBonus
        .merge (Record.of ({
          threshold: threshold instanceof List
            ? threshold.map (e => e.toString ())
            : threshold.toString (),
        })) as any as DamageBonusEditor;
    }
    else {
      return Record.of ({
        threshold: '',
      }) as DamageBonusEditor;
    }
  };

export const convertToEdit = (item: Record<ItemInstance>): Record<ItemEditorInstance> => {
  const otherProperties = item
    .delete ('note')
    .delete ('rules')
    .delete ('advantage')
    .delete ('disadvantage')
    .delete ('src');

  return otherProperties.merge (Record.of<ItemEditorSpecific> ({
    amount: ifNumberOrEmpty (item.lookup ('amount')),
    at: ifNumberOrEmpty (item.lookup ('at')),
    damageBonus: convertDamageBonusToEdit (item.lookup ('damageBonus')),
    damageDiceNumber: ifNumberOrEmpty (item.lookup ('damageDiceNumber')),
    damageFlat: ifNumberOrEmpty (item.lookup ('damageFlat')),
    enc: ifNumberOrEmpty (item.lookup ('enc')),
    length: ifNumberOrEmpty (item.lookup ('length')),
    pa: ifNumberOrEmpty (item.lookup ('pa')),
    price: ifNumberOrEmpty (item.lookup ('price')),
    pro: ifNumberOrEmpty (item.lookup ('pro')),
    range: Maybe.maybe<List<number>, List<string>> (List.of ('', '', ''))
                                                   (range => range.map (e => e.toString ()))
                                                   (item.lookup ('range')),
    reloadTime: ifNumberOrEmpty (item.lookup ('reloadTime')),
    stp: ifNumberOrEmpty (item.lookup ('stp')),
    weight: ifNumberOrEmpty (item.lookup ('weight')),
    movMod: ifNumberOrEmpty (item.lookup ('movMod')),
    iniMod: ifNumberOrEmpty (item.lookup ('iniMod')),
    stabilityMod: ifNumberOrEmpty (item.lookup ('stabilityMod')),
  })) as any as Record<ItemEditorInstance>;
};

const toInteger = (e: string, alt = 0) =>
  e.length > 0 ? Number.parseInt (e.replace (/\,/, '.')) : alt;

const toFloat = (e: string, alt = 0) =>
  e.length > 0 ? Number.parseFloat (e.replace (/\,/, '.')) : alt;

const convertDamageBonusToSave =
  (damageBonus: DamageBonusEditor): Maybe<NonNullable<DamageBonus>> => {
    const threshold = damageBonus.get ('threshold');

    if (
      threshold instanceof List
        ? threshold.all (e => e.length > 0)
        : threshold.length > 0
    ) {
      return Just (damageBonus.merge (Record.of ({
        threshold: threshold instanceof List
          ? threshold.map (Number.parseInt)
          : Number.parseInt (threshold),
      })) as any as NonNullable<DamageBonus>);
    }

    return Nothing ();
  };

export const convertToSave =
  (id: string) => (item: Record<ItemEditorInstance>): Record<ItemInstance> => {
    interface Additional {
      movMod?: number;
      iniMod?: number;
      stabilityMod?: number;
      improvisedWeaponGroup?: number;
    }

    const add =
      Record.of<Additional> ({})
        .update<'movMod'> (
          () => item.lookup ('movMod')
            .fmap (toInteger)
            .bind (Maybe.ensure (e => e > 0))
        )
        ('movMod')
        .update<'iniMod'> (
          () => item.lookup ('iniMod')
            .fmap (toInteger)
            .bind (Maybe.ensure (e => e > 0))
        ) ('iniMod')
        .update<'stabilityMod'> (() => item.lookup ('stabilityMod')
                                .fmap (toInteger)
                                .bind (Maybe.ensure (e => !Number.isNaN (e))))
                              ('stabilityMod')
        .update<'improvisedWeaponGroup'> (() => item.lookup ('improvisedWeaponGroup'))
                                        ('improvisedWeaponGroup');

    return item.mergeMaybe (Record.of ({
      id,
      amount: toInteger (item.get ('amount'), 1),
      at: toInteger (item.get ('at')),
      damageBonus: convertDamageBonusToSave (item.get ('damageBonus')),
      damageDiceNumber: toInteger (item.get ('damageDiceNumber')),
      damageFlat: toInteger (item.get ('damageFlat')),
      enc: toInteger (item.get ('enc')),
      length: toFloat (item.get ('length')),
      pa: toInteger (item.get ('pa')),
      price: toFloat (item.get ('price')),
      pro: toInteger (item.get ('pro')),
      range: item.get ('range').map (toInteger),
      reloadTime: toInteger (item.get ('reloadTime')),
      stp: toInteger (item.get ('stp')),
      weight: toFloat (item.get ('weight')),
      ...add,
    })) as any as Record<ItemInstance>;
  };

export const containsNaN = (item: Record<ItemInstance>): List<string> | false => {
  const filtered = item.keys ().filter (e => {
    const element = item.lookup (e);

    if (Maybe.isJust (element)) {
      const justElement = Maybe.fromJust (element);

      if (Array.isArray (justElement)) {
        return justElement.every (i => Number.isNaN (i));
      }
      else if (typeof element === 'number') {
        return Number.isNaN (element);
      }
    }

    return false;
  });

  if (filtered.length () === 0) {
    return false;
  }

  return filtered;
};

export const convertPrimaryAttributeToArray = (id: string): List<string> => {
  const [attr, ...ids] = id.split (/_/);

  return List.fromArray (ids.map (e => `${attr}_${e}`));
};

export interface ItemEditorInputValidation {
  name: boolean;
  amount: boolean;
  at: boolean;
  damageDiceNumber: boolean;
  damageFlat: boolean;
  firstDamageThreshold: boolean;
  secondDamageThreshold: boolean;
  damageThreshold: boolean;
  enc: boolean;
  ini: boolean;
  length: boolean;
  mov: boolean;
  pa: boolean;
  price: boolean;
  pro: boolean;
  range1: boolean;
  range2: boolean;
  range3: boolean;
  stabilityMod: boolean;
  structurePoints: boolean;
  weight: boolean;
  melee: boolean;
  ranged: boolean;
  armor: boolean;
  other: boolean;
}

const validateRange = (index: 0 | 1 | 2) => R.pipe (
  Record.get<ItemEditorInstance, 'range'> ('range'),
  List.subscript_ (index),
  Maybe.fmap (isEmptyOr (isNaturalNumber)),
  Maybe.elem (true)
);

/**
 * Is the user input in item editor valid?
 *
 * Returns validation info for every input and combined validation for specific
 * item groups.
 */
export const validateItemEditorInput = (item: Record<ItemEditorInstance>) => {
  const validName = item .get ('name') .length > 0;
  const validATMod = isInteger (item .get ('at'));
  const validDamageDiceNumber = isEmptyOr (isNaturalNumber) (item .get ('damageDiceNumber'));
  const validDamageFlat = isEmptyOr (isInteger) (item .get ('damageFlat'));

  const damageThreshold = item .get ('damageBonus') .get ('threshold');

  const validFirstDamageThreshold =
    damageThreshold instanceof List
    && Maybe.elem (true) (Maybe.listToMaybe (damageThreshold) .fmap (isNaturalNumber));

  const validSecondDamageThreshold =
    damageThreshold instanceof List
    && Maybe.elem (true) (List.last_ (damageThreshold) .fmap (isNaturalNumber));

  const validDamageThreshold = damageThreshold instanceof List
    ? validFirstDamageThreshold && validSecondDamageThreshold
    : damageThreshold.length > 0;

  const validENC = isNaturalNumber (item .get ('enc'));
  const validINIMod = isEmptyOr (isInteger) (item .get ('iniMod'));
  const validLength = isEmptyOr (isNaturalNumber) (item .get ('length'));
  const validMOVMod = isEmptyOr (isInteger) (item .get ('movMod'));
  const validNumber = isEmptyOr (isNaturalNumber) (item .get ('amount'));
  const validPAMod = isInteger (item .get ('pa'));
  const validPrice = isEmptyOr (isFloat) (item .get ('price'));
  const validPRO = isNaturalNumber (item .get ('pro'));
  const validRange1 = validateRange (0) (item);
  const validRange2 = validateRange (1) (item);
  const validRange3 = validateRange (2) (item);
  const validStabilityMod = isEmptyOr (isInteger) (item .get ('stabilityMod'));
  const validStructurePoints = isEmptyOr (isNaturalNumber) (item .get ('stp'));
  const validWeight = isEmptyOr (isFloat) (item .get ('weight'));

  const validMelee = Maybe.elem ('CT_7') (item .lookup ('combatTechnique'))
    ? List.of (
      validDamageDiceNumber,
      validDamageFlat,
      validLength,
      validNumber,
      validPrice,
      validStabilityMod,
      validStructurePoints,
      validWeight
    )
      .and ()
    : List.of (
      validATMod,
      validDamageDiceNumber,
      validDamageFlat,
      validDamageThreshold,
      validLength,
      validNumber,
      validPAMod,
      validPrice,
      validStabilityMod,
      validStructurePoints,
      validWeight,
      item .member ('combatTechnique'),
      item .member ('reach')
    )
      .and ();

  const validRanged = List.of (
    validDamageDiceNumber,
    validDamageFlat,
    validLength,
    validNumber,
    validPrice,
    validRange1,
    validRange2,
    validRange3,
    validStabilityMod,
    validWeight,
    item .member ('combatTechnique')
  )
    .and ();

  const validArmor = List.of (
    validENC,
    validINIMod,
    validMOVMod,
    validNumber,
    validPrice,
    validPRO,
    validStabilityMod,
    validWeight,
    item .member ('armorType')
  )
    .and ();

  const validOther = List.of (
    validName,
    validNumber,
    validPrice,
    validStructurePoints,
    validWeight
  )
    .and ();

  return Record.of<ItemEditorInputValidation> ({
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
    structurePoints: validStructurePoints,
    weight: validWeight,

    melee: validMelee,
    ranged: validRanged,
    armor: validArmor,
    other: validOther,
  });
};

export const getLossLevelElements = () => getLevelElementsWithZero (4);
