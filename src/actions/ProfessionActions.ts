import { ActionTypes } from '../constants/ActionTypes';
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace } from '../selectors/rcpSelectors';
import { getWiki } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions';
import { Selections } from '../types/data';
import { Maybe, Record } from '../utils/dataUtils';
import { Culture, Profession, ProfessionVariant, Race, WikiAll } from '../utils/wikiData/wikiTypeHelpers';

export interface SelectProfessionAction {
  type: ActionTypes.SELECT_PROFESSION;
  payload: {
    id: string;
  };
}

export const selectProfession = (id: string): SelectProfessionAction => ({
  type: ActionTypes.SELECT_PROFESSION,
  payload: {
    id
  }
});

interface SelectionsAndWikiEntries extends Selections {
  race: Record<Race>;
  culture: Record<Culture>;
  profession: Record<Profession>;
  professionVariant: Maybe<Record<ProfessionVariant>>;
  wiki: Record<WikiAll>;
}

export interface SetSelectionsAction {
  type: ActionTypes.ASSIGN_RCP_OPTIONS;
  payload: SelectionsAndWikiEntries;
}

export const setSelections = (selections: Selections): AsyncAction => (dispatch, getState) => {
  const state = getState ();

  Maybe.liftM3 ((race: Record<Race>) =>
                  (culture: Record<Culture>) =>
                    (profession: Record<Profession>) =>
                      dispatch<SetSelectionsAction> ({
                        type: ActionTypes.ASSIGN_RCP_OPTIONS,
                        payload: {
                          ...selections,
                          race,
                          culture,
                          profession,
                          professionVariant: getCurrentProfessionVariant (state),
                          wiki: getWiki (state)
                        }
                      })
                    )
               (getCurrentRace (state))
               (getCurrentCulture (state))
               (getCurrentProfession (state))
};

export interface SetProfessionsSortOrderAction {
  type: ActionTypes.SET_PROFESSIONS_SORT_ORDER;
  payload: {
    sortOrder: string;
  };
}

export const setProfessionsSortOrder = (sortOrder: string): SetProfessionsSortOrderAction => ({
  type: ActionTypes.SET_PROFESSIONS_SORT_ORDER,
  payload: {
    sortOrder
  }
});

export interface SetProfessionsVisibilityFilterAction {
  type: ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER;
  payload: {
    filter: string;
  };
}

export const setProfessionsVisibilityFilter =
  (filter: string): SetProfessionsVisibilityFilterAction => ({
    type: ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER,
    payload: {
      filter
    }
  });

export interface SetProfessionsGroupVisibilityFilterAction {
  type: ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER;
  payload: {
    filter: number;
  };
}

export const setProfessionsGroupVisibilityFilter =
  (filter: number): SetProfessionsGroupVisibilityFilterAction => ({
    type: ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER,
    payload: {
      filter
    }
  });

export interface SwitchProfessionsExpansionVisibilityFilterAction {
  type: ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER;
}

export const switchProfessionsExpansionVisibilityFilter =
  (): SwitchProfessionsExpansionVisibilityFilterAction => ({
    type: ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER
  });

export interface SetProfessionsFilterTextAction {
  type: ActionTypes.SET_PROFESSIONS_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export const setProfessionsFilterText = (filterText: string): SetProfessionsFilterTextAction => ({
  type: ActionTypes.SET_PROFESSIONS_FILTER_TEXT,
  payload: {
    filterText
  }
});
