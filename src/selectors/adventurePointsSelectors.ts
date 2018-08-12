import { createSelector } from 'reselect';
import { getAdventurePointsSpentDifference } from '../utils/adventurePointsUtils';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Maybe } from '../utils/dataUtils';
import { getAPRange } from '../utils/improvementCostUtils';
import { getAdvantagesForEdit, getDisadvantagesForEdit, getSpecialAbilitiesForEdit } from './activatableSelectors';
import { getCurrentProfession, getCurrentProfessionVariant, getCurrentRace } from './rcpSelectors';
import { getAdvantages, getAttributes, getBlessings, getCantrips, getCombatTechniques, getDisadvantages, getEnergies, getLiturgicalChants, getPhase, getSkills, getSpecialAbilities, getSpells, getTotalAdventurePoints, getWiki, getWikiCombatTechniques, getWikiLiturgicalChants, getWikiSkills, getWikiSpells } from './stateSelectors';

export const getAdventurePointsSpentForAttributes = createMaybeSelector(
  getAttributes,
  maybeList => Maybe.maybe(
    0,
    list => list.foldl(
      sum => e => sum + getAPRange(5, 8, e.get('value')),
      0
    ),
    maybeList
  )
);

export const getAdventurePointsSpentForSkills = createMaybeSelector(
  getSkills,
  getWikiSkills,
  (maybeList, wikiList) => Maybe.maybe(
    0,
    list => list.foldl(
      sum => e => Maybe.fromMaybe(
        sum,
        wikiList.lookup(e.get('id'))
          .fmap(
            skill => sum + getAPRange(
              skill.get('ic'),
              0,
              e.get('value')
            )
          )
      ),
      0
    ),
    maybeList
  )
);

export const getAdventurePointsSpentForCombatTechniques = createMaybeSelector(
  getCombatTechniques,
  getWikiCombatTechniques,
  (maybeList, wikiList) => Maybe.maybe(
    0,
    list => list.foldl(
      sum => e => Maybe.fromMaybe(
        sum,
        wikiList.lookup(e.get('id'))
          .fmap(
            combatTechnique => sum + getAPRange(
              combatTechnique.get('ic'),
              6,
              e.get('value')
            )
          )
      ),
      0
    ),
    maybeList
  )
);

export const getAdventurePointsSpentForSpells = createMaybeSelector(
  getSpells,
  getWikiSpells,
  (maybeList, wikiList) => Maybe.maybe(
    0,
    list => list.foldl(
      sum => e =>
      e.get('active')
        ? Maybe.fromMaybe(
            sum,
            wikiList.lookup(e.get('id'))
              .fmap(
                spell => sum + getAPRange(
                  spell.get('ic'),
                  0,
                  e.get('value')
                )
              )
          )
        : sum,
      0
    ),
    maybeList
  )
);

export const getAdventurePointsSpentForLiturgicalChants = createMaybeSelector(
  getLiturgicalChants,
  getWikiLiturgicalChants,
  (maybeList, wikiList) => Maybe.maybe(
    0,
    list => list.foldl(
      sum => e =>
      e.get('active')
        ? Maybe.fromMaybe(
            sum,
            wikiList.lookup(e.get('id'))
              .fmap(
                liturgicalChant => sum + getAPRange(
                  liturgicalChant.get('ic'),
                  0,
                  e.get('value')
                )
              )
          )
        : sum,
      0
    ),
    maybeList
  )
);

export const getAdventurePointsSpentForCantrips = createMaybeSelector(
  getCantrips,
  maybeList => Maybe.fromMaybe(0, maybeList.fmap(list => list.size()))
);

export const getAdventurePointsSpentForBlessings = createMaybeSelector(
  getBlessings,
  maybeList => Maybe.fromMaybe(0, maybeList.fmap(list => list.size()))
);

export const getAdventurePointsSpentForAdvantages = createMaybeSelector(
  getAdvantagesForEdit,
  getAdvantages,
  getWiki,
  (list, state, wiki) => {
    const baseAP = list.reduce((sum, obj) => sum + obj.cost, 0);
    const diffAP = getAdventurePointsSpentDifference(list, state, wiki);
    return baseAP + diffAP;
  }
);

export const getAdventurePointsSpentForMagicalAdvantages = createMaybeSelector(
  getAdvantagesForEdit,
  getAdvantages,
  getWiki,
  (list, state, wiki) => {
    const filteredList = list.filter(e => e.instance.gr === 2);
    const baseAP = filteredList.reduce((sum, obj) => sum + obj.cost, 0);
    const diffAP = calculateAdventurePointsSpentDifference(filteredList, state, wiki);
    return baseAP + diffAP;
  }
);

export const getAdventurePointsSpentForBlessedAdvantages = createMaybeSelector(
  getAdvantagesForEdit,
  getAdvantages,
  getWiki,
  (list, state, wiki) => {
    const filteredList = list.filter(e => e.instance.gr === 3);
    const baseAP = filteredList.reduce((sum, obj) => sum + obj.cost, 0);
    const diffAP = calculateAdventurePointsSpentDifference(filteredList, state, wiki);
    return baseAP + diffAP;
  }
);

export const getAdventurePointsSpentForDisadvantages = createMaybeSelector(
  getDisadvantagesForEdit,
  getDisadvantages,
  getWiki,
  (list, state, wiki) => {
    const baseAP = list.reduce((sum, obj) => sum + obj.cost, 0);
    const diffAP = calculateAdventurePointsSpentDifference(list, state, wiki);
    return baseAP + diffAP;
  }
);

export const getAdventurePointsSpentForMagicalDisadvantages = createMaybeSelector(
  getDisadvantagesForEdit,
  getDisadvantages,
  getWiki,
  (list, state, wiki) => {
    const filteredList = list.filter(e => e.instance.gr === 2);
    const baseAP = filteredList.reduce((sum, obj) => sum + obj.cost, 0);
    const diffAP = calculateAdventurePointsSpentDifference(filteredList, state, wiki);
    return baseAP + diffAP;
  }
);

export const getAdventurePointsSpentForBlessedDisadvantages = createMaybeSelector(
  getDisadvantagesForEdit,
  getDisadvantages,
  getWiki,
  (list, state, wiki) => {
    const filteredList = list.filter(e => e.instance.gr === 3);
    const baseAP = filteredList.reduce((sum, obj) => sum + obj.cost, 0);
    const diffAP = calculateAdventurePointsSpentDifference(filteredList, state, wiki);
    return baseAP + diffAP;
  }
);

export const getMagicalAdvantagesDisadvantagesAdventurePointsMaximum = createMaybeSelector(
  getDependentInstances,
  dependent => {
    return getAdvantagesDisadvantagesSubMax(dependent, 1);
  }
);

export const getAdventurePointsSpentForSpecialAbilities = createMaybeSelector(
  getSpecialAbilitiesForEdit,
  getSpecialAbilities,
  getWiki,
  (list, state, wiki) => {
    const baseAP = list.reduce((sum, obj) => sum + obj.cost, 0);
    const diffAP = calculateAdventurePointsSpentDifference(list, state, wiki);
    return baseAP + diffAP;
  }
);

export const getAdventurePointsSpentForEnergies = createMaybeSelector(
  getEnergies,
  energies => {
    const {
      addedArcaneEnergy,
      addedKarmaPoints,
      addedLifePoints,
      permanentArcaneEnergy: {
        redeemed: redeemedArcaneEnergy
      },
      permanentKarmaPoints: {
        redeemed: redeemedKarmaPoints
      },
    } = energies;
    const addedArcaneEnergyCost = getIncreaseRangeAP(4, 0, addedArcaneEnergy);
    const addedKarmaPointsCost = getIncreaseRangeAP(4, 0, addedKarmaPoints);
    const addedLifePointsCost = getIncreaseRangeAP(4, 0, addedLifePoints);
    const boughtBackArcaneEnergyCost = redeemedArcaneEnergy * 2;
    const boughtBackKarmaPointsCost = redeemedKarmaPoints * 2;
    return addedArcaneEnergyCost + addedKarmaPointsCost + addedLifePointsCost + boughtBackArcaneEnergyCost + boughtBackKarmaPointsCost;
  }
);

export const getAdventurePointsSpentForRace = createMaybeSelector(
  getCurrentRace,
  race => {
    return race ? race.ap : 0;
  }
);

export const getAdventurePointsSpentForProfession = createMaybeSelector(
  getCurrentProfession,
  getCurrentProfessionVariant,
  getPhase,
  (profession, professionVariant, phase) => {
    if (phase === 1 && typeof profession === 'object') {
      if (typeof professionVariant === 'object') {
        return profession.ap + professionVariant.ap;
      }
      return profession.ap;
    }
    return;
  }
);

export const getAdventurePointsSpentPart = createMaybeSelector(
  getAdventurePointsSpentForAttributes,
  getAdventurePointsSpentForSkills,
  getAdventurePointsSpentForCombatTechniques,
  getAdventurePointsSpentForSpells,
  getAdventurePointsSpentForLiturgicalChants,
  getAdventurePointsSpentForCantrips,
  getAdventurePointsSpentForBlessings,
  (...cost: number[]) => {
    return cost.reduce((a, b) => a + b, 0);
  }
);

export const getAdventurePointsSpent = createMaybeSelector(
  getAdventurePointsSpentPart,
  getAdventurePointsSpentForAdvantages,
  getAdventurePointsSpentForDisadvantages,
  getAdventurePointsSpentForSpecialAbilities,
  getAdventurePointsSpentForEnergies,
  getAdventurePointsSpentForRace,
  getAdventurePointsSpentForProfession,
  (part, ...cost: (number | undefined)[]) => {
    return cost.reduce<number>((a, b = 0) => a + b, part);
  }
);

export const getAvailableAdventurePoints = createMaybeSelector(
  getTotalAdventurePoints,
  getAdventurePointsSpent,
  (total, spent) => total - spent
);

export interface DisAdvAdventurePoints extends Array<number> {
  /**
   * Spent AP for Advantages/Disadvantages in total.
   */
  0: number;
  /**
   * Spent AP for magical Advantages/Disadvantages.
   */
  1: number;
  /**
   * Spent AP for blessed Advantages/Disadvantages.
   */
  2: number;
}

export interface AdventurePointsObjectPart {
  spentOnAttributes: number;
  spentOnSkills: number;
  spentOnCombatTechniques: number;
  spentOnSpells: number;
  spentOnLiturgicalChants: number;
  spentOnCantrips: number;
  spentOnBlessings: number;
  spentOnSpecialAbilities: number;
  spentOnEnergies: number;
  spentOnRace: number;
  spentOnProfession: number | undefined;
}

export interface AdventurePointsObject extends AdventurePointsObjectPart {
  total: number;
  spent: number;
  available: number;
  adv: DisAdvAdventurePoints;
  disadv: DisAdvAdventurePoints;
  spentOnAdvantages: number;
  spentOnMagicalAdvantages: number;
  spentOnBlessedAdvantages: number;
  spentOnDisadvantages: number;
  spentOnMagicalDisadvantages: number;
  spentOnBlessedDisadvantages: number;
}

export const getAdventurePointsObjectPart = createSelector(
  getAdventurePointsSpentForAttributes,
  getAdventurePointsSpentForSkills,
  getAdventurePointsSpentForCombatTechniques,
  getAdventurePointsSpentForSpells,
  getAdventurePointsSpentForLiturgicalChants,
  getAdventurePointsSpentForCantrips,
  getAdventurePointsSpentForBlessings,
  getAdventurePointsSpentForSpecialAbilities,
  getAdventurePointsSpentForEnergies,
  getAdventurePointsSpentForRace,
  getAdventurePointsSpentForProfession,
  (spentOnAttributes, spentOnSkills, spentOnCombatTechniques, spentOnSpells, spentOnLiturgicalChants, spentOnCantrips, spentOnBlessings, spentOnSpecialAbilities, spentOnEnergies, spentOnRace, spentOnProfession): AdventurePointsObjectPart => ({
    spentOnAttributes,
    spentOnSkills,
    spentOnCombatTechniques,
    spentOnSpells,
    spentOnLiturgicalChants,
    spentOnCantrips,
    spentOnBlessings,
    spentOnSpecialAbilities,
    spentOnEnergies,
    spentOnRace,
    spentOnProfession
  })
);

export const getAdventurePointsObject = createSelector(
  getTotalAdventurePoints,
  getAdventurePointsSpent,
  getAvailableAdventurePoints,
  getAdventurePointsSpentForAdvantages,
  getAdventurePointsSpentForBlessedAdvantages,
  getAdventurePointsSpentForMagicalAdvantages,
  getAdventurePointsSpentForDisadvantages,
  getAdventurePointsSpentForBlessedDisadvantages,
  getAdventurePointsSpentForMagicalDisadvantages,
  getAdventurePointsObjectPart,
  (total, spent, available, advantages, blessedAdvantages, magicalAdvantages, disadvantages, blessedDisadvantages, magicalDisadvantages, part): AdventurePointsObject => ({
    ...part,
    total,
    spent,
    available,
    adv: [advantages, magicalAdvantages, blessedAdvantages],
    disadv: [disadvantages, magicalDisadvantages, blessedDisadvantages],
    spentOnAdvantages: advantages,
    spentOnMagicalAdvantages: magicalAdvantages,
    spentOnBlessedAdvantages: blessedAdvantages,
    spentOnDisadvantages: disadvantages,
    spentOnMagicalDisadvantages: magicalDisadvantages,
    spentOnBlessedDisadvantages: blessedDisadvantages,
  })
);
