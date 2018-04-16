import { createSelector } from 'reselect';
import * as Data from '../types/data';
import * as View from '../types/view';
import * as Wiki from '../types/wiki';
import { AllSortOptions } from '../utils/FilterSortUtils';
import { _translate } from '../utils/I18n';
import { getLocaleMessages, getSex } from './stateSelectors';
import * as uiSettingsSelectors from './uisettingsSelectors';

export const getRacesSortOptions = createSelector(
  uiSettingsSelectors.getRacesSortOrder,
  sortOrder => {
    let sortOptions: AllSortOptions<Wiki.Race | View.Race> = 'name';

    if (sortOrder === 'cost') {
      sortOptions = ['ap', 'name'];
    }

    return sortOptions;
  }
);

export const getCulturesSortOptions = createSelector(
  uiSettingsSelectors.getCulturesSortOrder,
  sortOrder => {
    let sortOptions: AllSortOptions<Wiki.Culture | View.Culture> = 'name';

    if (sortOrder === 'cost') {
      sortOptions = ['culturalPackageAdventurePoints', 'name'];
    }

    return sortOptions;
  }
);

function getProfessionSourceKey(e: Wiki.Profession | View.Profession): string {
  return e.src[0] ? e.src[0].id : 'US25000';
};

export const getProfessionsSortOptions = createSelector(
  uiSettingsSelectors.getProfessionsSortOrder,
  getSex,
  (sortOrder, sex) => {
    let sortOptions: AllSortOptions<Wiki.Profession | View.Profession> = [
      { key: 'name', keyOfProperty: sex },
      { key: 'subname', keyOfProperty: sex },
      { key: getProfessionSourceKey }
    ];

    if (sortOrder === 'cost') {
      sortOptions = [
        'ap',
        { key: 'name', keyOfProperty: sex },
        { key: 'subname', keyOfProperty: sex },
        { key: getProfessionSourceKey }
      ];
    }

    return sortOptions;
  }
);

export const getSkillsSortOptions = createSelector(
  uiSettingsSelectors.getTalentsSortOrder,
  sortOrder => {
    let sortOptions: AllSortOptions<Wiki.Skill | Data.TalentInstance> = 'name';

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
  uiSettingsSelectors.getCombatTechniquesSortOrder,
  sortOrder => {
    type Targets = Wiki.CombatTechnique | View.CombatTechniqueWithRequirements;

    let sortOptions: AllSortOptions<Targets> = 'name';

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
  uiSettingsSelectors.getSpecialAbilitiesSortOrder,
  getLocaleMessages,
  (sortOrder, locale) => {
    type ActiveTarget = Data.ActiveViewObject<Data.SpecialAbilityInstance>;
    type InactiveTarget = Data.DeactiveViewObject<Data.SpecialAbilityInstance>;
    type Targets = ActiveTarget | InactiveTarget;

    let sortOptions: AllSortOptions<Targets> = 'name';

    if (sortOrder === 'groupname') {
      sortOptions = [
        {
          key: obj => obj.instance.gr,
          mapToIndex: _translate(locale, 'specialabilities.view.groups')
        },
        'name'
      ];
    }

    return sortOptions;
  }
);

export const getSpellsSortOptions = createSelector(
  uiSettingsSelectors.getSpellsSortOrder,
  getLocaleMessages,
  (sortOrder, locale) => {
    type Targets = Wiki.Spell | Data.SpellInstance | Data.CantripInstance;

    let sortOptions: AllSortOptions<Targets> = 'name';

    if (sortOrder === 'property') {
      sortOptions = [
        {
          key: 'property',
          mapToIndex: _translate(locale, 'spells.view.properties')
        },
        'name'
      ];
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
  uiSettingsSelectors.getSpellsSortOrder,
  getLocaleMessages,
  (sortOrder, locale) => {
    let sortOptions: AllSortOptions<Wiki.Cantrip> = 'name';

    if (sortOrder === 'property') {
      sortOptions = [
        {
          key: 'property',
          mapToIndex: _translate(locale, 'spells.view.properties')
        },
        'name'
      ];
    }

    return sortOptions;
  }
);

export const getLiturgicalChantsSortOptions = createSelector(
  uiSettingsSelectors.getLiturgiesSortOrder,
  sortOrder => {
    type LiturgicalChantTargets = Wiki.LiturgicalChant | Data.LiturgyInstance;
    type Targets = LiturgicalChantTargets | Data.BlessingInstance;

    let sortOptions: AllSortOptions<Targets> = 'name';

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
  uiSettingsSelectors.getEquipmentSortOrder,
  getLocaleMessages,
  (sortOrder, locale) => {
    type Targets = Wiki.ItemTemplate | Data.ItemInstance;

    let sortOptions: AllSortOptions<Targets> = 'name';

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
