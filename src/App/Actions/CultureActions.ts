import * as ActionTypes from "../Constants/ActionTypes";
import { CulturesSortOptions, CulturesVisibilityFilter } from "../Utilities/Raw/JSON/Config";

export interface SelectCultureAction {
  type: ActionTypes.SELECT_CULTURE
  payload: {
    id: string;
  }
}

export const selectCulture = (id: string): SelectCultureAction => ({
  type: ActionTypes.SELECT_CULTURE,
  payload: {
    id,
  },
})

export interface SetCulturesSortOrderAction {
  type: ActionTypes.SET_CULTURES_SORT_ORDER
  payload: {
    sortOrder: CulturesSortOptions;
  }
}

export const setSortOrder = (sortOrder: CulturesSortOptions): SetCulturesSortOrderAction => ({
  type: ActionTypes.SET_CULTURES_SORT_ORDER,
  payload: {
    sortOrder,
  },
})

export interface SetCulturesVisibilityFilterAction {
  type: ActionTypes.SET_CULTURES_VISIBILITY_FILTER
  payload: {
    filter: CulturesVisibilityFilter;
  }
}

export const setVisibilityFilter =
  (filter: CulturesVisibilityFilter): SetCulturesVisibilityFilterAction => ({
    type: ActionTypes.SET_CULTURES_VISIBILITY_FILTER,
    payload: {
      filter,
    },
  })

export interface SwitchCultureValueVisibilityAction {
  type: ActionTypes.SWITCH_CULTURE_VALUE_VISIBILITY
}

export const switchValueVisibilityFilter = (): SwitchCultureValueVisibilityAction => ({
  type: ActionTypes.SWITCH_CULTURE_VALUE_VISIBILITY,
})

export interface SetCulturesFilterTextAction {
  type: ActionTypes.SET_CULTURES_FILTER_TEXT
  payload: {
    filterText: string;
  }
}

export const setFilterText = (filterText: string): SetCulturesFilterTextAction => ({
  type: ActionTypes.SET_CULTURES_FILTER_TEXT,
  payload: {
    filterText,
  },
})
