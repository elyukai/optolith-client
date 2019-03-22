import { liftM3, Maybe } from "../../Data/Maybe";
import { Record } from "../../Data/Record";
import { ActionTypes } from "../Constants/ActionTypes";
import { Selections } from "../Models/Hero/heroTypeHelpers";
import { Culture } from "../Models/Wiki/Culture";
import { Profession } from "../Models/Wiki/Profession";
import { ProfessionVariant } from "../Models/Wiki/ProfessionVariant";
import { Race } from "../Models/Wiki/Race";
import { WikiModelRecord } from "../Models/Wiki/WikiModel";
import { getCurrentCulture, getCurrentProfession, getCurrentProfessionVariant, getCurrentRace } from "../Selectors/rcpSelectors";
import { getWiki } from "../Selectors/stateSelectors";
import { ReduxAction } from "./Actions";

export interface SelectProfessionAction {
  type: ActionTypes.SELECT_PROFESSION
  payload: {
    id: string;
  }
}

export const selectProfession = (id: string): SelectProfessionAction => ({
  type: ActionTypes.SELECT_PROFESSION,
  payload: {
    id,
  },
})

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
