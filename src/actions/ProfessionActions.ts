import { ActionTypes } from '../constants/ActionTypes';
import { AsyncAction } from '../types/actions';
import { Selections } from '../types/data';
import { Culture, Profession, ProfessionVariant, Race, WikiAll } from '../types/wiki';
import { Maybe, Record } from '../utils/dataUtils';

export interface SelectProfessionAction {
  type: ActionTypes.SELECT_PROFESSION;
  payload: {
    id: string;
  };
}

export function _selectProfession(id: string): SelectProfessionAction {
  return {
    type: ActionTypes.SELECT_PROFESSION,
    payload: {
      id
    }
  };
}

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

export function _setSelections(selections: Selections): AsyncAction {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.ASSIGN_RCP_OPTIONS,
      payload: selections
    }
  };
}

export interface SetProfessionsSortOrderAction {
  type: ActionTypes.SET_PROFESSIONS_SORT_ORDER;
  payload: {
    sortOrder: string;
  };
}

export function _setProfessionsSortOrder(sortOrder: string): SetProfessionsSortOrderAction {
  return {
    type: ActionTypes.SET_PROFESSIONS_SORT_ORDER,
    payload: {
      sortOrder
    }
  };
}

export interface SetProfessionsVisibilityFilterAction {
  type: ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER;
  payload: {
    filter: string;
  };
}

export function _setProfessionsVisibilityFilter(filter: string): SetProfessionsVisibilityFilterAction {
  return {
    type: ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER,
    payload: {
      filter
    }
  };
}

export interface SetProfessionsGroupVisibilityFilterAction {
  type: ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER;
  payload: {
    filter: number;
  };
}

export function _setProfessionsGroupVisibilityFilter(filter: number): SetProfessionsGroupVisibilityFilterAction {
  return {
    type: ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER,
    payload: {
      filter
    }
  };
}

export interface SwitchProfessionsExpansionVisibilityFilterAction {
  type: ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER;
}

export function _switchProfessionsExpansionVisibilityFilter(): SwitchProfessionsExpansionVisibilityFilterAction {
  return {
    type: ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER
  };
}

export interface SetProfessionsFilterTextAction {
  type: ActionTypes.SET_PROFESSIONS_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export function setFilterText(filterText: string): SetProfessionsFilterTextAction {
  return {
    type: ActionTypes.SET_PROFESSIONS_FILTER_TEXT,
    payload: {
      filterText
    }
  };
}
