import R from 'ramda';
import * as Data from '../types/data.d';
import { CombatTechnique, WikiAll } from '../types/wiki';
import { flattenDependencies } from './flattenDependencies';
import { getAllEntriesByGroup } from './heroStateUtils';
import { isActive } from './isActive';
import { Maybe, isJust } from './maybe';
import { getActiveSelections } from './selectionUtils';

const getMaxPrimaryAttributeValueById = (
  state: Data.HeroDependent,
  primaryAttributeIds: string[],
) => {
  return primaryAttributeIds.reduce((max, id) => {
    const attribute = Maybe(state.attributes.get(id));

    if (isJust(attribute)) {
      return Math.max(max, attribute.value.value);
    }

    return max;
  }, 0);
};

export const getPrimaryAttributeMod = (
  state: Data.HeroDependent,
  primaryAttributeIds: string[],
) => {
  return R.pipe(
    R.add(-8),
    e => R.divide(e, 3),
    Math.floor,
    e => Math.max(e, 0),
  )(getMaxPrimaryAttributeValueById(state, primaryAttributeIds));
};

export const getAttack = (
  state: Data.HeroDependent,
  wikiEntry: CombatTechnique,
  instance: Data.SkillDependent,
): number => {
	const array = wikiEntry.gr === 2 ? wikiEntry.primary : ['ATTR_1'];
	const mod = getPrimaryAttributeMod(state, array);
	return instance.value + mod;
};

export const getParry = (
  state: Data.HeroDependent,
  wikiEntry: CombatTechnique,
  instance: Data.SkillDependent,
): number | undefined => {
  if (wikiEntry.gr === 2 || instance.id === 'CT_6' || instance.id === 'CT_8') {
    return;
  }

  const mod = getPrimaryAttributeMod(state, wikiEntry.primary);
	return Math.round(instance.value / 2) + mod;
};

export const isIncreaseDisabled = (
  wiki: WikiAll,
  state: Data.HeroDependent,
  wikiEntry: CombatTechnique,
  instance: Data.SkillDependent,
): boolean => {
  let max = 0;

  const exceptionalSkill = state.advantages.get('ADV_17');
  const selectedExceptionalSkills = getActiveSelections(exceptionalSkill);
	const bonus = selectedExceptionalSkills.includes(instance.id) ? 1 : 0;

	if (state.phase < 3) {
    const startEl = Maybe(wiki.experienceLevels.get(state.experienceLevel));
    if (isJust(startEl)) {
      max = startEl.value.maxCombatTechniqueRating;
    }
	}
	else {
		max = getMaxPrimaryAttributeValueById(state, wikiEntry.primary) + 2;
	}

	return instance.value >= max + bonus;
};

export const isDecreaseDisabled = (
  wiki: WikiAll,
  state: Data.HeroDependent,
  wikiEntry: CombatTechnique,
  instance: Data.SkillDependent,
): boolean => {
  const hunterActive = isActive(state.specialAbilities.get('SA_18'));

  const onlyOneCombatTechniqueForHunter = hunterActive && R.equals(
    R.length(
      R.filter(
        e => e.value >= 10,
        getAllEntriesByGroup(
          wiki.combatTechniques,
          state.combatTechniques,
          2,
        )
      )
    ),
    1,
  );

  const disabledByHunter = onlyOneCombatTechniqueForHunter
    && wikiEntry.gr === 2
    && instance.value === 10;

  const dependencies = flattenDependencies(
    wiki,
    state,
    instance.dependencies,
  );

	return disabledByHunter || instance.value <= Math.max(6, ...dependencies);
};
