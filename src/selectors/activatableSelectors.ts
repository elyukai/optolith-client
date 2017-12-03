import { createSelector } from 'reselect';
import * as Categories from '../constants/Categories';
import { DependentInstancesState } from '../reducers/dependentInstances';
import * as Data from '../types/data.d';
import { convertPerTierCostToFinalCost, getActiveFromState, getDeactiveView, getNameCost, getSelectionName, getSids, getTraditionNameFromFullName, getValidation, isActive } from '../utils/ActivatableUtils';
import { _translate } from '../utils/I18n';
import { validateAddingExtendedSpecialAbilities } from '../utils/RequirementUtils';
import { filterByInstancePropertyAvailability } from '../utils/RulesUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { get, getAllByCategory, getMapByCategory } from './dependentInstancesSelectors';
import { getBlessedTradition } from './liturgiesSelectors';
import { getMessages } from './localeSelectors';
import { getCultureAreaKnowledge } from './profileSelectors';
import { getCurrentCulture, getCurrentProfession, getCurrentRace } from './rcpSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getMagicalTraditions } from './spellsSelectors';
import { getAdvantages, getCurrentHeroPresent, getDisadvantages, getLocaleMessages, getSpecialAbilities } from './stateSelectors';

export function getForSave(state: DependentInstancesState): { [id: string]: Data.ActiveObject[] } {
  const allEntries = [
    ...getAllByCategory(state, Categories.ADVANTAGES),
    ...getAllByCategory(state, Categories.DISADVANTAGES),
    ...getAllByCategory(state, Categories.SPECIAL_ABILITIES),
  ];
  return allEntries.filter(e => isActive(e)).reduce((a, b) => ({ ...a, [b.id]: b.active }), {});
}

export const getActive = (category: Categories.ACTIVATABLE, addTierToName: boolean) => {
  return createSelector(
    getAdvantages,
    getDisadvantages,
    getSpecialAbilities,
    getCurrentHeroPresent,
    getLocaleMessages,
    (advantages, disadvantages, specialAbilities, state, locale) => {
      const { dependent } = state;
      const allEntries = (category === Categories.ADVANTAGES ? advantages : category === Categories.DISADVANTAGES ? disadvantages : specialAbilities) as Map<string, Data.ActivatableInstance>;
      const finalEntries: Data.ActiveViewObject[] = [];

      const activeEntries = getActiveFromState(allEntries);

      for (const activeObject of activeEntries) {
        const {
          id,
          index,
          tier
        } = activeObject;

        const {
          combinedName,
          currentCost,
          cost,
          tierName
        } = convertPerTierCostToFinalCost(getNameCost(activeObject, dependent, false, locale), locale, addTierToName);

        const {
          disabled,
          maxTier,
          minTier
        } = getValidation(activeObject, state);

        const instance = get(dependent, id) as Data.ActivatableInstance;

        finalEntries.push({
          id,
          index,
          name: combinedName,
          cost: currentCost,
          gr: instance.gr,
          disabled,
          instance,
          maxTier,
          minTier,
          tier,
          customCost: typeof cost === 'number',
          tierName
        });
      }

      return finalEntries;
    }
  );
};

export const getActiveForView = (category: Categories.ACTIVATABLE) => {
  return getActive(category, false);
};

export const getActiveForEditView = (category: Categories.ACTIVATABLE) => {
  return getActive(category, true);
};

export const getDeactiveForView = <T extends Categories.ACTIVATABLE>(category: T) => {
  return createSelector(
    getCurrentHeroPresent,
    getLocaleMessages,
    validateAddingExtendedSpecialAbilities,
    (state, locale, validExtendedSpecialAbilities) => {
      const { dependent } = state;
      const allEntries = getMapByCategory(dependent, category) as Map<string, Data.InstanceByCategory[T]>;
      const finalEntries: Data.DeactiveViewObject<Data.InstanceByCategory[T]>[] = [];
      if (locale) {
        for (const entry of allEntries) {
          const obj = getDeactiveView(entry[1], state, validExtendedSpecialAbilities, locale);
          if (obj) {
            finalEntries.push(obj);
          }
        }
      }
      return finalEntries;
    }
  );
};

export const getAdvantagesRating = createSelector(
  getCurrentRace,
  getCurrentCulture,
  getCurrentProfession,
  (race, culture, profession) => {
    const rating: Data.ToListById<string> = {};

    if (race && culture && profession) {
      race.commonAdvantages.forEach(e => { rating[e] = 'TYP'; });
      race.uncommonAdvantages.forEach(e => { rating[e] = 'UNTYP'; });
      culture.typicalAdvantages.forEach(e => { rating[e] = 'TYP'; });
      culture.untypicalAdvantages.forEach(e => { rating[e] = 'UNTYP'; });
      profession.typicalAdvantages.forEach(e => { rating[e] = 'TYP'; });
      profession.untypicalAdvantages.forEach(e => { rating[e] = 'UNTYP'; });
      race.stronglyRecommendedAdvantages.forEach(e => { rating[e] = 'IMP'; });
    }

    return rating;
  }
);

export const getDisadvantagesRating = createSelector(
  getCurrentRace,
  getCurrentCulture,
  getCurrentProfession,
  (race, culture, profession) => {
    const rating: Data.ToListById<string> = {};

    if (race && culture && profession) {
      race.commonDisadvantages.forEach(e => { rating[e] = 'TYP'; });
      race.uncommonDisadvantages.forEach(e => { rating[e] = 'UNTYP'; });
      culture.typicalDisadvantages.forEach(e => { rating[e] = 'TYP'; });
      culture.untypicalDisadvantages.forEach(e => { rating[e] = 'UNTYP'; });
      profession.typicalDisadvantages.forEach(e => { rating[e] = 'TYP'; });
      profession.untypicalDisadvantages.forEach(e => { rating[e] = 'UNTYP'; });
      race.stronglyRecommendedDisadvantages.forEach(e => { rating[e] = 'IMP'; });
    }

    return rating;
  }
);

export const getAdvantagesForSheet = createSelector(
  getActiveForView(Categories.ADVANTAGES),
  active => active
);

export const getAdvantagesForEdit = createSelector(
  getActiveForEditView(Categories.ADVANTAGES),
  active => active
);

export const getDeactiveAdvantages = createSelector(
  getDeactiveForView(Categories.ADVANTAGES),
	getRuleBooksEnabled,
	(list, availablility) => {
		return filterByInstancePropertyAvailability(list, availablility);
	}
);

export const getDisadvantagesForSheet = createSelector(
  getActiveForView(Categories.DISADVANTAGES),
  active => active
);

export const getDisadvantagesForEdit = createSelector(
  getActiveForEditView(Categories.DISADVANTAGES),
  active => active
);

export const getDeactiveDisadvantages = createSelector(
  getDeactiveForView(Categories.DISADVANTAGES),
	getRuleBooksEnabled,
	(list, availablility) => {
		return filterByInstancePropertyAvailability(list, availablility);
	}
);

export const getSpecialAbilitiesForSheet = createSelector(
  getActiveForView(Categories.SPECIAL_ABILITIES),
  active => active
);

export const getSpecialAbilitiesForEdit = createSelector(
  getActiveForEditView(Categories.SPECIAL_ABILITIES),
  active => active
);

export const getDeactiveSpecialAbilities = createSelector(
  getDeactiveForView(Categories.SPECIAL_ABILITIES),
	getRuleBooksEnabled,
	(list, availablility) => {
		return filterByInstancePropertyAvailability(list, availablility);
	}
);

export const getGeneralSpecialAbilitiesForSheet = createSelector(
  [ getSpecialAbilitiesForSheet, getMessages, getCultureAreaKnowledge ],
  (specialAbilities, messages, cultureAreaKnowledge = '') => {
    return [
      ...specialAbilities.filter(e => [1, 2, 22, 30].includes(e.gr!)),
      _translate(messages!, 'charactersheet.main.generalspecialabilites.areaknowledge', cultureAreaKnowledge)
    ];
  }
);

export const getCombatSpecialAbilitiesForSheet = createSelector(
  [ getSpecialAbilitiesForSheet ],
  specialAbilities => {
    return specialAbilities.filter(e => [3, 9, 10, 11, 12, 21].includes(e.gr!));
  }
);

export const getMagicalSpecialAbilitiesForSheet = createSelector(
  [ getSpecialAbilitiesForSheet ],
  specialAbilities => {
    return specialAbilities.filter(e => [4, 5, 6, 13, 14, 15, 16, 17, 18, 19, 20, 28].includes(e.gr!));
  }
);

export const getBlessedSpecialAbilitiesForSheet = createSelector(
  [ getSpecialAbilitiesForSheet ],
  specialAbilities => {
    return specialAbilities.filter(e => [7, 8, 23, 24, 25, 26, 27, 29].includes(e.gr!));
  }
);

export const getFatePointsModifier = createSelector(
  mapGetToSlice(getAdvantages, 'ADV_14'),
  mapGetToSlice(getDisadvantages, 'DISADV_31'),
  (luck, badLuck) => {
    const luckActive = luck && luck.active[0];
    const badLuckActive = badLuck && badLuck.active[0];
    if (luckActive) {
      return luckActive.tier!;
    }
    if (badLuckActive) {
      return badLuckActive.tier! * -1;
    }
    return 0;
  }
);

export const getMagicalTraditionForSheet = createSelector(
  getMagicalTraditions,
  specialAbilities => specialAbilities.map(e => getTraditionNameFromFullName(e.name)).join(', ')
);

export const getPropertyKnowledgesForSheet = createSelector(
  mapGetToSlice(getSpecialAbilities, 'SA_72'),
  propertyKnowledge => getSids(propertyKnowledge!).map(e => getSelectionName(propertyKnowledge!, e)!)
);

export const getBlessedTraditionForSheet = createSelector(
  getBlessedTradition,
  tradition => tradition && getTraditionNameFromFullName(tradition.name)
);

export const getAspectKnowledgesForSheet = createSelector(
  mapGetToSlice(getSpecialAbilities, 'SA_87'),
  aspectKnowledge => getSids(aspectKnowledge!).map(e => getSelectionName(aspectKnowledge!, e)!)
);

export const getInitialStartingWealth = createSelector(
  mapGetToSlice(getAdvantages, 'ADV_36'),
  mapGetToSlice(getDisadvantages, 'DISADV_2'),
  (rich, poor) => {
    if (rich && isActive(rich)) {
      return 750 + rich.active[0]!.tier! * 250;
    }
    else if (poor && isActive(poor)) {
      return 750 - poor.active[0]!.tier! * 250;
    }
    return 750;
  }
);
