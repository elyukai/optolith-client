import { fromJust, isJust, liftM3, listToMaybe, Maybe, Nothing } from "../../Data/Maybe"
import { lookup } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import * as ActionTypes from "../Constants/ActionTypes"
import { AppState } from "../Models/AppState"
import { ProfessionsGroupVisibilityFilter, ProfessionsSortOptions, ProfessionsVisibilityFilter } from "../Models/Config"
import { Selections } from "../Models/Hero/heroTypeHelpers"
import { Culture } from "../Models/Wiki/Culture"
import { Profession } from "../Models/Wiki/Profession"
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant"
import { Race } from "../Models/Wiki/Race"
import { StaticData, StaticDataRecord } from "../Models/Wiki/WikiModel"
import { getCurrentCulture } from "../Selectors/cultureSelectors"
import { getCurrentProfession, getCurrentProfessionVariant } from "../Selectors/professionSelectors"
import { getCurrentRace } from "../Selectors/raceSelectors"
import { getWiki } from "../Selectors/stateSelectors"
import { pipe_ } from "../Utilities/pipe"
import { ReduxAction } from "./Actions"

const ASA = AppState.A
const SDA = StaticData.A
const PA = Profession.A

export interface SelectProfessionAction {
  type: ActionTypes.SELECT_PROFESSION
  payload: {
    id: string
    var_id: Maybe<string>
  }
}

export const selectProfession =
  (id: string): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()

    const mselected_prof = pipe_ (state, ASA.wiki, SDA.professions, lookup (id))

    if (isJust (mselected_prof)) {
      const selected_prof = fromJust (mselected_prof)

      dispatch<SelectProfessionAction> ({
        type: ActionTypes.SELECT_PROFESSION,
        payload: {
          id,
          var_id: PA.isVariantRequired (selected_prof)
                  ? listToMaybe (PA.variants (selected_prof))
                  : Nothing,
        },
      })
    }
  }

interface SelectionsAndWikiEntries extends Selections {
  race: Record<Race>
  culture: Record<Culture>
  profession: Record<Profession>
  professionVariant: Maybe<Record<ProfessionVariant>>
  wiki: StaticDataRecord
}

export interface SetSelectionsAction {
  type: ActionTypes.ASSIGN_RCP_OPTIONS
  payload: SelectionsAndWikiEntries
}

export const setSelections =
  (selections: Selections): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()

    liftM3 ((r: Record<Race>) => (c: Record<Culture>) => (p: Record<Profession>) =>
             dispatch<SetSelectionsAction> ({
               type: ActionTypes.ASSIGN_RCP_OPTIONS,
               payload: {
                 ...selections,
                 race: r,
                 culture: c,
                 profession: p,
                 professionVariant: getCurrentProfessionVariant (state),
                 wiki: getWiki (state),
               },
             }))
          (getCurrentRace (state))
          (getCurrentCulture (state))
          (getCurrentProfession (state))
  }

export interface SetProfessionsSortOrderAction {
  type: ActionTypes.SET_PROFESSIONS_SORT_ORDER
  payload: {
    sortOrder: ProfessionsSortOptions
  }
}

export const setProfessionsSortOrder =
  (sortOrder: ProfessionsSortOptions): SetProfessionsSortOrderAction => ({
    type: ActionTypes.SET_PROFESSIONS_SORT_ORDER,
    payload: {
      sortOrder,
    },
  })

export interface SetProfessionsVisibilityFilterAction {
  type: ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER
  payload: {
    filter: ProfessionsVisibilityFilter
  }
}

export const setProfessionsVisibilityFilter =
  (filter: ProfessionsVisibilityFilter): SetProfessionsVisibilityFilterAction => ({
    type: ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER,
    payload: {
      filter,
    },
  })

export interface SetProfessionsGroupVisibilityFilterAction {
  type: ActionTypes.SET_PROFESSIONS_GR_VISIBILITY_FILTER
  payload: {
    filter: ProfessionsGroupVisibilityFilter
  }
}

export const setProfessionsGroupVisibilityFilter =
  (filter: ProfessionsGroupVisibilityFilter): SetProfessionsGroupVisibilityFilterAction => ({
    type: ActionTypes.SET_PROFESSIONS_GR_VISIBILITY_FILTER,
    payload: {
      filter,
    },
  })

export interface SetProfessionsFilterTextAction {
  type: ActionTypes.SET_PROFESSIONS_FILTER_TEXT
  payload: {
    filterText: string
  }
}

export const setProfessionsFilterText = (filterText: string): SetProfessionsFilterTextAction => ({
  type: ActionTypes.SET_PROFESSIONS_FILTER_TEXT,
  payload: {
    filterText,
  },
})
