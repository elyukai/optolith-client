import { Maybe } from "../../Data/Maybe"
import * as ActionTypes from "../Constants/ActionTypes"
import { RacesSortOptions } from "../Models/Config"

export interface SelectRaceAction {
  type: ActionTypes.SELECT_RACE
  payload: {
    id: string
    variantId: Maybe<string>
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
    id: string
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
    sortOrder: RacesSortOptions
  }
}

export const setRacesSortOrder = (sortOrder: RacesSortOptions): SetRacesSortOrderAction => ({
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
    filterText: string
  }
}

export const setFilterText = (filterText: string): SetRacesFilterTextAction => ({
  type: ActionTypes.SET_RACES_FILTER_TEXT,
  payload: {
    filterText,
  },
})
