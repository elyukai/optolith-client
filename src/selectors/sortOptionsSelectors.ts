import * as Data from '../types/data';
import * as View from '../types/view';
import * as Wiki from '../types/wiki';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Maybe, Record } from '../utils/dataUtils';
import { AllSortOptions } from '../utils/FilterSortUtils';
import { translate } from '../utils/I18n';
import { getLocaleAsProp, getSex } from './stateSelectors';
import * as uiSettingsSelectors from './uisettingsSelectors';

export const getRacesSortOptions = createMaybeSelector (
  uiSettingsSelectors.getRacesSortOrder,
  (sortOrder): AllSortOptions<Wiki.Race> | AllSortOptions<View.RaceCombined> =>
    sortOrder === 'cost' ? ['ap', 'name'] : 'name'
);

export const getCulturesSortOptions = createMaybeSelector (
  uiSettingsSelectors.getCulturesSortOrder,
  (sortOrder): AllSortOptions<Wiki.Culture> | AllSortOptions<View.CultureCombined> =>
    sortOrder === 'cost' ? ['culturalPackageAdventurePoints', 'name'] : 'name'
);

const getProfessionSourceKey = (
  e: Record<Wiki.Profession> | Record<View.ProfessionCombined>
): string => Maybe.fromMaybe ('US25000')
                             (Maybe.listToMaybe (e.get ('src')).fmap (head => head.get ('id')));

type ProfessionSortOptions =
  AllSortOptions<Wiki.Profession> |
  AllSortOptions<View.ProfessionCombined>;

export const getProfessionsSortOptions = createMaybeSelector (
  uiSettingsSelectors.getProfessionsSortOrder,
  getSex,
  (sortOrder, maybeSex): Maybe<ProfessionSortOptions> =>
    maybeSex.fmap (
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

export const getSkillsSortOptions = createMaybeSelector (
  uiSettingsSelectors.getTalentsSortOrder,
  sortOrder => {
    let sortOptions: AllSortOptions<Wiki.Skill | View.SkillCombined> = 'name';

    if (sortOrder === 'ic') {
      sortOptions = ['ic', 'name'];
    }
    else if (sortOrder === 'group') {
      sortOptions = ['gr', 'name'];
    }

    return sortOptions;
  }
);

export const getCombatTechniquesSortOptions = createMaybeSelector (
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

export const getSpecialAbilitiesSortOptions = createMaybeSelector (
  uiSettingsSelectors.getSpecialAbilitiesSortOrder,
  getLocaleAsProp,
  (sortOrder, locale) => {
    type ActiveTarget = Data.ActiveViewObject<Wiki.SpecialAbility>;
    type InactiveTarget = Data.DeactiveViewObject<Wiki.SpecialAbility>;
    type Targets = ActiveTarget | InactiveTarget;

    let sortOptions: AllSortOptions<Targets> = 'name';

    if (sortOrder === 'groupname') {
      sortOptions = [
        {
          key: obj => obj.get ('wikiEntry').get ('gr'),
          mapToIndex: translate (locale, 'specialabilities.view.groups')
        },
        'name'
      ];
    }

    return sortOptions;
  }
);

export const getSpellsSortOptions = createMaybeSelector (
  uiSettingsSelectors.getSpellsSortOrder,
  getLocaleAsProp,
  (sortOrder, locale) => {
    type Targets = Wiki.Spell
      | View.SpellCombined
      | Wiki.Cantrip & { ic?: undefined; gr?: undefined };

    let sortOptions: AllSortOptions<Targets> = 'name';

    if (sortOrder === 'property') {
      sortOptions = [
        {
          key: 'property',
          mapToIndex: translate (locale, 'spells.view.properties')
        },
        'name'
      ];
    }
    else if (sortOrder === 'ic') {
      sortOptions = [{ key: r => r.lookupWithDefault<'ic'> (0) ('ic') }, 'name'];
    }
    else if (sortOrder === 'group') {
      sortOptions = [{ key: r => r.lookupWithDefault<'gr'> (1000) ('gr') }, 'name'];
    }

    return sortOptions;
  }
);

export const getLiturgicalChantsSortOptions = createMaybeSelector (
  uiSettingsSelectors.getLiturgiesSortOrder,
  sortOrder => {
    type LiturgicalChantTargets = Wiki.LiturgicalChant | View.LiturgicalChantCombined;
    type Targets = LiturgicalChantTargets | Wiki.Blessing & { ic?: undefined; gr?: undefined };

    let sortOptions: AllSortOptions<Targets> = 'name';

    if (sortOrder === 'ic') {
      sortOptions = [{ key: r => r.lookupWithDefault<'ic'> (0) ('ic') }, 'name'];
    }
    else if (sortOrder === 'group') {
      sortOptions = [{ key: r => r.lookupWithDefault<'gr'> (1000) ('gr') }, 'name'];
    }

    return sortOptions;
  }
);

export const getEquipmentSortOptions = createMaybeSelector (
  uiSettingsSelectors.getEquipmentSortOrder,
  getLocaleAsProp,
  (sortOrder, locale) => {
    type Targets = Wiki.ItemTemplate | Data.ItemInstance;

    let sortOptions: AllSortOptions<Targets> = 'name';

    if (sortOrder === 'groupname') {
      const groups = translate (locale, 'equipment.view.groups');
      sortOptions = [{ key: 'gr', mapToIndex: groups }, 'name'];
    }
    else if (sortOrder === 'where') {
      sortOptions = ['where', 'name'];
    }
    else if (sortOrder === 'weight') {
      sortOptions = [
        { key: r => r.get ('weight'), reverse: true },
        'name'
      ];
    }

    return sortOptions;
  }
);
