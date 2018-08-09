import { createSelector } from 'reselect';
import { ToListById } from '../types/data.d';
import { filterAndSortObjects } from '../utils/FilterSortUtils';
import { getCurrentCulture } from './rcpSelectors';
import { getSkillsSortOptions } from './sortOptionsSelectors';
import { getLocaleMessages, getSkills, getSkillsFilterText } from './stateSelectors';

export const getSkillsForSave = createSelector(
  getSkills,
  skills => {
    const active: ToListById<number> = {};

    for (const [id, { value }] of skills) {
      if (value > 0) {
        active[id] = value;
      }
    }

    return active;
  }
);

export const getAllSkills = createSelector(
  getSkills,
  skills => {
    return [...skills.values()];
  }
);

export const getFilteredSkills = createSelector(
  getAllSkills,
  getSkillsSortOptions,
  getSkillsFilterText,
  getLocaleMessages,
  (skills, sortOptions, filterText, locale) => {
    return filterAndSortObjects(skills, locale!.id, filterText, sortOptions);
  }
);

export const getTalentsRating = createSelector(
  getCurrentCulture,
  culture => {
    const rating: ToListById<string> = {};

    if (culture) {
      culture.commonSkills.forEach(e => { rating[e] = 'TYP'; });
      culture.uncommonSkills.forEach(e => { rating[e] = 'UNTYP'; });
    }

    return rating;
  }
);
