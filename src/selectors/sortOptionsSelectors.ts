import { createSelector } from 'reselect';
import { ActiveViewObject, BlessingInstance, CantripInstance, DeactiveViewObject, ItemInstance, LiturgyInstance, SpecialAbilityInstance, SpellInstance, TalentInstance } from '../types/data';
import * as View from '../types/view';
import { Cantrip, CombatTechnique, Culture, ItemTemplate, LiturgicalChant, Profession, Race, Skill, Spell } from '../types/wiki';
import { AllSortOptions } from '../utils/FilterSortUtils';
import { _translate } from '../utils/I18n';
import { getLocaleMessages, getSex } from './stateSelectors';
import { getCombatTechniquesSortOrder, getCulturesSortOrder, getEquipmentSortOrder, getLiturgiesSortOrder, getProfessionsSortOrder, getRacesSortOrder, getSpecialAbilitiesSortOrder, getSpellsSortOrder, getTalentsSortOrder } from './uisettingsSelectors';

export const getRacesSortOptions = createSelector(
  getRacesSortOrder,
  sortOrder => {
		let sortOptions: AllSortOptions<Race | View.Race> = 'name';
		if (sortOrder === 'cost') {
			sortOptions = ['ap', 'name'];
		}
		return sortOptions;
  }
);

export const getCulturesSortOptions = createSelector(
  getCulturesSortOrder,
  sortOrder => {
		let sortOptions: AllSortOptions<Culture | View.Culture> = 'name';
		if (sortOrder === 'cost') {
			sortOptions = ['culturalPackageAdventurePoints', 'name'];
		}
		return sortOptions;
  }
);

const sourceKey = (e: Profession | View.Profession) => {
	return e.src[0] ? e.src[0].id : 'US25000';
};

export const getProfessionsSortOptions = createSelector(
  getProfessionsSortOrder,
  getSex,
  (sortOrder, sex) => {
		let sortOptions: AllSortOptions<Profession | View.Profession> = [
			{ key: 'name', keyOfProperty: sex },
			{ key: 'subname', keyOfProperty: sex },
			{ key: sourceKey }
		];
		if (sortOrder === 'cost') {
			sortOptions = [
				'ap',
				{ key: 'name', keyOfProperty: sex },
				{ key: 'subname', keyOfProperty: sex },
				{ key: sourceKey }
			];
		}
		return sortOptions;
  }
);

export const getSkillsSortOptions = createSelector(
  getTalentsSortOrder,
  sortOrder => {
		let sortOptions: AllSortOptions<Skill | TalentInstance> = 'name';
		if (sortOrder === 'ic') {
			sortOptions = ['ic', 'name'];
    }
		else if (sortOrder === 'group') {
			sortOptions = ['gr', 'name'];
    }
		return sortOptions;
  }
);

export const getCombatTechniquesSortOptions = createSelector(
  getCombatTechniquesSortOrder,
  sortOrder => {
		let sortOptions: AllSortOptions<CombatTechnique | View.CombatTechniqueWithRequirements> = 'name';
		if (sortOrder === 'ic') {
			sortOptions = ['ic', 'name'];
    }
		else if (sortOrder === 'group') {
			sortOptions = ['gr', 'name'];
    }
		return sortOptions;
  }
);

export const getSpecialAbilitiesSortOptions = createSelector(
  getSpecialAbilitiesSortOrder,
  getLocaleMessages,
  (sortOrder, locale) => {
		let sortOptions: AllSortOptions<ActiveViewObject<SpecialAbilityInstance> | DeactiveViewObject<SpecialAbilityInstance>> = 'name';
		if (sortOrder === 'groupname') {
			sortOptions = [{ key: obj => obj.instance.gr, mapToIndex: _translate(locale, 'specialabilities.view.groups') }, 'name'];
    }
		return sortOptions;
  }
);

export const getSpellsSortOptions = createSelector(
  getSpellsSortOrder,
  getLocaleMessages,
  (sortOrder, locale) => {
		let sortOptions: AllSortOptions<Spell | SpellInstance | CantripInstance> = 'name';
		if (sortOrder === 'property') {
			sortOptions = [{ key: 'property', mapToIndex: _translate(locale, 'spells.view.properties')}, 'name'];
    }
		else if (sortOrder === 'ic') {
			sortOptions = [{ key: ({ ic = 0 }) => ic }, 'name'];
    }
		else if (sortOrder === 'group') {
			sortOptions = [{ key: ({ gr = 1000 }) => gr }, 'name'];
    }
		return sortOptions;
  }
);

export const getCantripsSortOptions = createSelector(
  getSpellsSortOrder,
  getLocaleMessages,
  (sortOrder, locale) => {
		let sortOptions: AllSortOptions<Cantrip> = 'name';
		if (sortOrder === 'property') {
			sortOptions = [{ key: 'property', mapToIndex: _translate(locale, 'spells.view.properties')}, 'name'];
    }
		return sortOptions;
  }
);

export const getLiturgicalChantsSortOptions = createSelector(
  getLiturgiesSortOrder,
  sortOrder => {
		let sortOptions: AllSortOptions<LiturgicalChant | LiturgyInstance | BlessingInstance> = 'name';
		if (sortOrder === 'ic') {
			sortOptions = [{ key: ({ ic = 0 }) => ic }, 'name'];
    }
		else if (sortOrder === 'group') {
			sortOptions = [{ key: ({ gr = 1000 }) => gr }, 'name'];
    }
		return sortOptions;
  }
);

export const getEquipmentSortOptions = createSelector(
  getEquipmentSortOrder,
  getLocaleMessages,
  (sortOrder, locale) => {
		let sortOptions: AllSortOptions<ItemTemplate | ItemInstance> = 'name';
		if (sortOrder === 'groupname') {
			const groups = _translate(locale, 'equipment.view.groups');
			sortOptions = [{ key: 'gr', mapToIndex: groups }, 'name'];
		}
		else if (sortOrder === 'weight') {
			sortOptions = [
				{ key: ({ weight = 0 }) => weight, reverse: true },
				'name'
			];
		}
		return sortOptions;
  }
);
