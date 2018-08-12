import { createSelector } from 'reselect';
import * as Data from '../types/data';
import * as View from '../types/view';
import * as Wiki from '../types/wiki';
import { Maybe, Record } from '../utils/dataUtils';
import { AllSortOptions } from '../utils/FilterSortUtils';
import { translate } from '../utils/I18n';
import { getLocaleMessages, getSex } from './stateSelectors';
import * as uiSettingsSelectors from './uisettingsSelectors';

export const getRacesSortOptions = createSelector(
  uiSettingsSelectors.getRacesSortOrder,
  (sortOrder): AllSortOptions<Wiki.Race> | AllSortOptions<View.RaceCombined> =>
    sortOrder === 'cost' ? ['ap', 'name'] : 'name'
);

export const getCulturesSortOptions = createSelector(
  uiSettingsSelectors.getCulturesSortOrder,
  (sortOrder): AllSortOptions<Wiki.Culture> | AllSortOptions<View.CultureCombined> =>
    sortOrder === 'cost' ? ['culturalPackageAdventurePoints', 'name'] : 'name'
);

const getProfessionSourceKey = (
  e: Record<Wiki.Profession> | Record<View.ProfessionCombined>
): string => Maybe.fromMaybe('US25000', e.get('src').head().fmap(head => head.get('id')));

type ProfessionSortOptions =
  AllSortOptions<Wiki.Profession> |
  AllSortOptions<View.ProfessionCombined>;

export const getProfessionsSortOptions = createSelector(
  uiSettingsSelectors.getProfessionsSortOrder,
  getSex,
  (sortOrder, maybeSex): Maybe<ProfessionSortOptions> =>
    maybeSex.fmap(
      sex => {
        if (sortOrder === 'cost') {
          const sortOptions1: ProfessionSortOptions = [
            'ap',
            { key: 'name', keyOfProperty: sex },
            { key: 'subname', keyOfProperty: sex },
            { key: getProfessionSourceKey }
          ];

          return sortOptions1;
        }

        const sortOptions2: ProfessionSortOptions = [
          { key: 'name', keyOfProperty: sex },
          { key: 'subname', keyOfProperty: sex },
          { key: getProfessionSourceKey }
        ];

        return sortOptions2;
      }
    )
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
          mapToIndex: translate(locale, 'specialabilities.view.groups')
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
          mapToIndex: translate(locale, 'spells.view.properties')
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
          mapToIndex: translate(locale, 'spells.view.properties')
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
      const groups = translate(locale, 'equipment.view.groups');
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
