import { createSelector } from 'reselect';
import { getAdvantages, getDisadvantages, getSpecialAbilities, getWikiAdvantages, getWikiAttributes, getWikiBlessings, getWikiBooks, getWikiCantrips, getWikiCombatTechniques, getWikiCultures, getWikiDisadvantages, getWikiExperienceLevels, getWikiItemTemplates, getWikiLiturgicalChants, getWikiProfessions, getWikiProfessionVariants, getWikiRaces, getWikiRaceVariants, getWikiSkills, getWikiSpecialAbilities, getWikiSpells } from '../selectors/stateSelectors';
import { getAllCultures, getAllProfessions, getAllRaces } from './rcpSelectors';

const getFirstPartWikiEntries = createSelector(
  getWikiBlessings,
  getWikiCantrips,
  getWikiCombatTechniques,
  getAllCultures,
  getWikiItemTemplates,
  getAdvantages,
  getDisadvantages,
  getSpecialAbilities,
  // getWikiAdvantages,
  // getWikiAttributes,
  // getWikiBooks,
  // getWikiDisadvantages,
  // getWikiExperienceLevels,
  (blessings, cantrips, combatTechniques, cultures, itemTemplates, advantages, disadvantages, specialAbilties) => {
    return [
      ...blessings.values(),
      ...cantrips.values(),
      ...combatTechniques.values(),
      ...cultures,
      ...itemTemplates.values(),
      ...advantages.values(),
      ...disadvantages.values(),
      ...specialAbilties.values(),
      // ...advantages.values(),
      // ...attributes.values(),
      // ...books.values(),
      // ...disadvantages.values(),
      // ...experienceLevels.values(),
    ];
  }
);

export const getAllWikiEntries = createSelector(
  getFirstPartWikiEntries,
  getWikiLiturgicalChants,
  getAllProfessions,
  getAllRaces,
  getWikiSkills,
  getWikiSpells,
  // getWikiProfessionVariants,
  // getWikiRaceVariants,
  // getWikiSpecialAbilities,
  (firstPart, liturgicalChants, professions, races, skills, spells) => {
    return [
      ...firstPart,
      ...liturgicalChants.values(),
      ...professions,
      // ...professionVariants.values(),
      ...races,
      // ...raceVariants.values(),
      ...skills.values(),
      // ...specialAbilities.values(),
      ...spells.values()
    ];
  }
);
