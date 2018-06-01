import { WikiState } from '../reducers/wikiReducer';
import { AdventurePointsObject } from '../selectors/adventurePointsSelectors';
import * as Data from '../types/data.d';
import { getActiveWithNoCustomCost } from './activatableCostUtils';
import { exists } from './exists';
import { getMagicalTraditions } from './traditionUtils';

/**
 * Checks if there are enough AP available.
 * @param cost The AP value you want to check.
 * @param ap The current AP state.
 * @param negativeApValid If the character's AP left can be a negative value
 * (during character creation) or not.
 */
export const areSufficientAPAvailable = (
  cost: number,
  availableAP: number,
  negativeApValid: boolean,
): boolean => {
  if (cost > 0 && negativeApValid === false) {
    return cost <= availableAP;
  }

  return true;
};

/**
 * Returns the maximum AP value you can spend on magical/blessed
 * advantages/disadvantages.
 * @param state The list of dependent instances.
 * @param index The index in the AP array. `0` equals General, `1` equals
 * Magical and `2` equals Blessed.
 */
export const getDisAdvantagesSubtypeMax = (
  state: Data.HeroDependent,
  isMagical: boolean,
): number => {
  if (isMagical) {
    const traditionActive = getMagicalTraditions(state.specialAbilities)[0];
    const semiTraditionIds = ['SA_677', 'SA_678', 'SA_679', 'SA_680'];

    if (traditionActive && semiTraditionIds.includes(traditionActive.id)) {
      return 25;
    }
  }

  return 50;
};

export interface SufficientAPAvailableForDisAdvantage {
  readonly totalValid: boolean;
  readonly mainValid: boolean;
  readonly subValid: boolean;
}

const getDisAdvantageSubtypeAPSpent = (
  isMagicalOrBlessed: {
    isBlessed: boolean;
    isMagical: boolean;
  },
  isDisadvantage: boolean,
  adventurePoints: AdventurePointsObject,
): number | undefined => {
  const { isBlessed, isMagical } = isMagicalOrBlessed;

  if (isDisadvantage) {
    if (isMagical) {
      return adventurePoints.spentOnMagicalDisadvantages;
    }
    else if (isBlessed) {
      return adventurePoints.spentOnBlessedDisadvantages;
    }
  }
  else if (isMagical) {
    return adventurePoints.spentOnMagicalAdvantages;
  }
  else if (isBlessed) {
    return adventurePoints.spentOnBlessedAdvantages;
  }

  return;
}

/**
 * Checks if there are enough AP available and if the restrictions for
 * advantages/disadvantages will be met.
 * @param cost The AP value you want to check.
 * @param ap The current AP state.
 * @param state The list of dependent instances.
 * @param isMagicalOrBlessed If the the advantage/disadvantage is magical or
 * blessed.
 * @param isDisadvantage If the entry is a disadvantage.
 * @param isInCharacterCreation If the character's AP left can be a negative
 * value (during character creation) or not.
 */
export const areSufficientAPAvailableForDisAdvantage = (
  cost: number,
  adventurePoints: AdventurePointsObject,
  state: Data.HeroDependent,
  isMagicalOrBlessed: {
    isBlessed: boolean;
    isMagical: boolean;
  },
  isDisadvantage: boolean,
  isInCharacterCreation: boolean,
): SufficientAPAvailableForDisAdvantage => {
  const { isMagical } = isMagicalOrBlessed;

  const currentAPSpent = isDisadvantage
    ? adventurePoints.spentOnDisadvantages
    : adventurePoints.spentOnAdvantages;

  const subCurrentAPSpent = getDisAdvantageSubtypeAPSpent(
    isMagicalOrBlessed,
    isDisadvantage,
    adventurePoints,
  );

  const smallMax = getDisAdvantagesSubtypeMax(state, isMagical);
  const equalizedCost = isDisadvantage ? cost * -1 : cost;

  const subValid = !isInCharacterCreation
    || (exists(subCurrentAPSpent)
      ? subCurrentAPSpent + equalizedCost <= smallMax
      : true);

  const mainValid = !isInCharacterCreation
    || currentAPSpent + equalizedCost <= 80;

  const totalValid = cost <= adventurePoints.available || isInCharacterCreation;

  return { totalValid, mainValid, subValid };
};

const getPrinciplesObligationsDiff = (
  entries: Data.ActiveViewObject[],
  state: Map<string, Data.ActivatableInstance>,
  wiki: WikiState,
  sourceId: string,
): number => {
  if (entries.some(e => e.id === sourceId)) {
    const { active } = state.get(sourceId)!;

    const maxCurrentTier = active.reduce((a, b) => {
      const isNotCustom = b.cost === undefined;
      if (typeof b.tier === 'number' && b.tier > a && isNotCustom) {
        return b.tier;
      }
      return a;
    }, 0);

    // next lower tier
    const subMaxCurrentTier = active.reduce((a, b) => {
      const isNotCustom = b.cost === undefined;
      if (
        typeof b.tier === 'number' &&
        b.tier > a &&
        b.tier < maxCurrentTier &&
        isNotCustom
      ) {
        return b.tier;
      }
      return a;
    }, 0);

    const amountMaxTiers = active.reduce((a, b) => {
      if (maxCurrentTier === b.tier) {
        return a + 1;
      }
      return a;
    }, 0);

    const baseCost = wiki.disadvantages.get(sourceId)!.cost as number;
    const amountDiff = amountMaxTiers > 1 ? maxCurrentTier * -baseCost : 0;
    const levelDiff = subMaxCurrentTier * -baseCost;

    return amountDiff + levelDiff;
  }

  return 0;
}

const getPropertyOrAspectKnowledgeDiff = (
  state: Map<string, Data.ActivatableInstance>,
  apArr: number[],
): number => {
  const { active } = state.get('SA_72')!;

  const actualAPSum = apArr.reduce((a, b, i) => {
    return i + 1 < active.length ? a + b : a;
  }, 0);

  // Sum of displayed AP values for entries (not actual sum)
  const displayedAPSumForAll = apArr[active.length - 1] * (active.length - 1);

  return actualAPSum - displayedAPSumForAll;
}

export function getAdventurePointsSpentDifference(
  entries: Data.ActiveViewObject[],
  state: Map<string, Data.ActivatableInstance>,
  wiki: WikiState,
): number {
  let diff = 0;

  diff += getPrinciplesObligationsDiff(entries, state, wiki, 'DISADV_34');
  diff += getPrinciplesObligationsDiff(entries, state, wiki, 'DISADV_50');

  if (entries.some(e => e.id === 'DISADV_33')) {
    const { active } = state.get('DISADV_33')!;
    if (active.filter(e => e.sid === 7 && e.cost === undefined).length > 1) {
      diff -= wiki.disadvantages.get('DISADV_33')!.select!
        .find(e => e.id === 7)!.cost!;
    }
  }

  if (entries.some(e => e.id === 'DISADV_36')) {
    const { active } = state.get('DISADV_36')!;
    if (getActiveWithNoCustomCost(active).length > 3) {
      diff -= (wiki.disadvantages.get('DISADV_36')!.cost as number) * 3;
    }
  }

  if (entries.some(e => e.id === 'SA_9')) {
    const { active } = state.get('SA_9')!;
    const sameSkill = new Map<string, number>();
    const skillDone = new Map<string, number>();

    for (const { sid } of active) {
      const id = sid as string;
      if (sameSkill.has(id)) {
        sameSkill.set(id, sameSkill.get(id)! + 1);
      }
      else {
        sameSkill.set(id, 1);
      }
    }

    for (const { sid } of active) {
      const id = sid as string;
      const counter = sameSkill.get(id)!;
      if (!skillDone.has(id) || skillDone.get(id)! < counter) {
        const current = skillDone.get(id) || 0;
        const skill = wiki.skills.get(id)!;
        diff += skill.ic * (current + 1 - counter);
        skillDone.set(id, current + 1);
      }
    }
  }

  if (entries.some(e => e.id === 'SA_72')) {
    diff += getPropertyOrAspectKnowledgeDiff(state, [10, 20, 40]);
  }

  if (entries.some(e => e.id === 'SA_87')) {
    diff += getPropertyOrAspectKnowledgeDiff(state, [15, 25, 45]);
  }

  return diff;
}
