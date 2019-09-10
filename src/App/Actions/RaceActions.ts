import { Maybe } from "../../Data/Maybe";
import { ActionTypes } from "../Constants/ActionTypes";
import { SortNames } from "../Views/Universal/SortOptions";

export interface SelectRaceAction {
  type: ActionTypes.SELECT_RACE
  payload: {
    id: string;
    variantId: Maybe<string>;
  }
}

export const selectRace = (id: string) => (variantId: Maybe<string>): SelectRaceAction => ({
  type: ActionTypes.SELECT_RACE,
  payload: {
    id,
    variantId,
  },
})

export interface SetRaceVariantAction {
  type: ActionTypes.SET_RACE_VARIANT
  payload: {
    id: string;
  }
}

export const selectRaceVariant = (id: string): SetRaceVariantAction => ({
  type: ActionTypes.SET_RACE_VARIANT,
  payload: {
    id,
  },
})

export interface SetRacesSortOrderAction {
  type: ActionTypes.SET_RACES_SORT_ORDER
  payload: {
    sortOrder: SortNames;
  }
}

export const setRacesSortOrder = (sortOrder: SortNames): SetRacesSortOrderAction => ({
  type: ActionTypes.SET_RACES_SORT_ORDER,
  payload: {
    sortOrder,
  },
})

export interface SwitchRaceValueVisibilityAction {
  type: ActionTypes.SWITCH_RACE_VALUE_VISIBILITY
}

export const switchRaceValueVisibilityFilter = (): SwitchRaceValueVisibilityAction => ({
  type: ActionTypes.SWITCH_RACE_VALUE_VISIBILITY,
})

export interface SetRacesFilterTextAction {
  type: ActionTypes.SET_RACES_FILTER_TEXT
  payload: {
    filterText: string;
  }
}

export const setFilterText = (filterText: string): SetRacesFilterTextAction => ({
  type: ActionTypes.SET_RACES_FILTER_TEXT,
  payload: {
    filterText,
  },
})
