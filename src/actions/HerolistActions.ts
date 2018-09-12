import { ActionTypes } from '../constants/ActionTypes';
import { getHeroes, getWikiExperienceLevels } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions';
import { UIMessagesObject } from '../types/ui';
import { Maybe } from '../utils/dataUtils';
import { translate } from '../utils/I18n';
import { getNewIdByDate } from '../utils/IDUtils';
import { addAlert } from './AlertActions';
import { requestAllHeroesSave, requestHeroDeletion, requestHeroExport, requestHeroSave } from './IOActions';

export interface SetHerolistSortOrderAction {
  type: ActionTypes.SET_HEROLIST_SORT_ORDER;
  payload: {
    sortOrder: string;
  };
}

export const setHerolistSortOrder = (sortOrder: string): SetHerolistSortOrderAction => ({
  type: ActionTypes.SET_HEROLIST_SORT_ORDER,
  payload: {
    sortOrder
  }
});

export interface SetHerolistVisibilityFilterAction {
  type: ActionTypes.SET_HEROLIST_VISIBILITY_FILTER;
  payload: {
    filterOption: string;
  };
}

export const setHerolistVisibilityFilter =
  (filterOption: string): SetHerolistVisibilityFilterAction => ({
    type: ActionTypes.SET_HEROLIST_VISIBILITY_FILTER,
    payload: {
      filterOption
    }
  });

export interface CreateHeroAction {
  type: ActionTypes.CREATE_HERO;
  payload: {
    id: string;
    name: string;
    sex: 'm' | 'f';
    el: string;
    enableAllRuleBooks: boolean;
    enabledRuleBooks: Set<string>;
    totalAp: number;
  };
}

export const createHero = (
  name: string,
  sex: 'm' | 'f',
  el: string,
  enableAllRuleBooks: boolean,
  enabledRuleBooks: Set<string>,
): AsyncAction => (dispatch, getState) => {
  const state = getState ();

  const maybeSelectedExperienceLevel = getWikiExperienceLevels (state).lookup (el);

  if (Maybe.isJust (maybeSelectedExperienceLevel)) {
    const selectedExperienceLevel = Maybe.fromJust (maybeSelectedExperienceLevel);
    const totalAp = selectedExperienceLevel.get ('ap');

    dispatch<CreateHeroAction> ({
      type: ActionTypes.CREATE_HERO,
      payload: {
        id: `H_${getNewIdByDate ()}`,
        name,
        sex,
        el,
        enableAllRuleBooks,
        enabledRuleBooks,
        totalAp,
      }
    });
  }
};

export interface LoadHeroAction {
  type: ActionTypes.LOAD_HERO;
  payload: {
    id: string;
  };
}

export const loadHero = (id: string): LoadHeroAction => ({
  type: ActionTypes.LOAD_HERO,
  payload: {
    id
  }
});

export const saveHeroes = (locale: UIMessagesObject): AsyncAction => dispatch => {
  dispatch (requestAllHeroesSave (locale));
  dispatch (addAlert ({
    message: translate (locale, 'fileapi.allsaved')
  }));
};

export interface SaveHeroAction {
  type: ActionTypes.SAVE_HERO;
  payload: {
    id: string;
  };
}

export const saveHero = (locale: UIMessagesObject) =>
  (id: Maybe<string>): AsyncAction =>
    dispatch => {
      dispatch (requestHeroSave (locale) (id))
        .then (
          maybeId => Maybe.fromNullable (maybeId)
            .fmap (
              actualId => dispatch<SaveHeroAction> ({
                type: ActionTypes.SAVE_HERO,
                payload: {
                  id: actualId // specified by param or currently open
                }
              })
            )
        );
    };

export const exportHeroValidate = (locale: UIMessagesObject) => (id: string): AsyncAction =>
  dispatch => dispatch (requestHeroExport (locale) (id));

export interface DeleteHeroAction {
  type: ActionTypes.DELETE_HERO;
  payload: {
    id: string;
  };
}

export const deleteHero = (id: string): DeleteHeroAction => ({
  type: ActionTypes.DELETE_HERO,
  payload: {
    id
  }
});

export const deleteHeroValidate = (locale: UIMessagesObject) =>
  (id: string): AsyncAction =>
    (dispatch, getState) => {
      const state = getState ();
      const heroes = getHeroes (state);
      const maybeHero = heroes.lookup (id);

      if (Maybe.isJust (maybeHero)) {
        const hero = Maybe.fromJust (maybeHero);

        const resolve: AsyncAction = futureDispatch => {
          futureDispatch (deleteHero (id));
          futureDispatch (requestHeroDeletion (locale) (id));
        };

        // @ts-ignore
        dispatch (addAlert ({
          title: translate (locale, 'heroes.warnings.delete.title', hero.present.get ('name')),
          message: translate (locale, 'heroes.warnings.delete.message'),
          confirm: {
            resolve
          },
          confirmYesNo: true
        }));
      }
    };

export interface DuplicateHeroAction {
  type: ActionTypes.DUPLICATE_HERO;
  payload: {
    id: string;
    newId: string;
  };
}

export const duplicateHero = (id: string): DuplicateHeroAction => {
  const newId = `H_${getNewIdByDate ()}`;

  return {
    type: ActionTypes.DUPLICATE_HERO,
    payload: {
      id,
      newId
    }
  };
};
