import { fromJust, isJust, liftM3, listToMaybe, Maybe, Nothing } from "../../Data/Maybe";
import { lookup } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { ActionTypes } from "../Constants/ActionTypes";
import { Selections } from "../Models/Hero/heroTypeHelpers";
import { Culture } from "../Models/Wiki/Culture";
import { Profession } from "../Models/Wiki/Profession";
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant";
import { Race } from "../Models/Wiki/Race";
import { WikiModel, WikiModelRecord } from "../Models/Wiki/WikiModel";
import { AppState } from "../Reducers/appReducer";
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace } from "../Selectors/rcpSelectors";
import { getWiki } from "../Selectors/stateSelectors";
import { pipe_ } from "../Utilities/pipe";
import { ReduxAction, ReduxActions } from "./Actions";

export interface SelectProfessionAction {
  type: ActionTypes.SELECT_PROFESSION
  payload: {
    id: string;
    var_id: Maybe<string>;
  }
}

export const selectProfession =
  (id: string): ReduxActions =>
  (dispatch, getState) => {
    const state = getState ();

    const mselected_prof = pipe_ (state, AppState.A.wiki, WikiModel.A.professions, lookup (id))

    if (isJust (mselected_prof)) {
      const selected_prof = fromJust (mselected_prof)

      dispatch<SelectProfessionAction> ({
        type: ActionTypes.SELECT_PROFESSION,
        payload: {
          id,
          var_id:
            Profession.A.isVariantRequired (selected_prof)
              ? listToMaybe (Profession.A.variants (selected_prof))
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
  wiki: WikiModelRecord
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
    sortOrder: string;
  }
}

export const setProfessionsSortOrder = (sortOrder: string): SetProfessionsSortOrderAction => ({
  type: ActionTypes.SET_PROFESSIONS_SORT_ORDER,
  payload: {
    sortOrder,
  },
})

export interface SetProfessionsVisibilityFilterAction {
  type: ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER
  payload: {
    filter: string;
  }
}

export const setProfessionsVisibilityFilter =
  (filter: string): SetProfessionsVisibilityFilterAction => ({
    type: ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER,
    payload: {
      filter,
    },
  })

export interface SetProfessionsGroupVisibilityFilterAction {
  type: ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER
  payload: {
    filter: number;
  }
}

export const setProfessionsGroupVisibilityFilter =
  (filter: number): SetProfessionsGroupVisibilityFilterAction => ({
    type: ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER,
    payload: {
      filter,
    },
  })

export interface SwitchProfessionsExpansionVisibilityFilterAction {
  type: ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER
}

export const switchProfessionsExpansionVisibilityFilter =
  (): SwitchProfessionsExpansionVisibilityFilterAction => ({
    type: ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER,
  })

export interface SetProfessionsFilterTextAction {
  type: ActionTypes.SET_PROFESSIONS_FILTER_TEXT
  payload: {
    filterText: string;
  }
}

export const setProfessionsFilterText = (filterText: string): SetProfessionsFilterTextAction => ({
  type: ActionTypes.SET_PROFESSIONS_FILTER_TEXT,
  payload: {
    filterText,
  },
})
