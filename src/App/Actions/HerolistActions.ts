import { tryIO } from "../../Control/Exception";
import { fmap } from "../../Data/Functor";
import { List } from "../../Data/List";
import { fromJust, isJust, Maybe } from "../../Data/Maybe";
import { lookup } from "../../Data/OrderedMap";
import { OrderedSet } from "../../Data/OrderedSet";
import { ActionTypes } from "../Constants/ActionTypes";
import { HeroModel } from "../Models/Hero/HeroModel";
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel";
import { L10nRecord } from "../Models/Wiki/L10n";
import { heroReducer } from "../Reducers/heroReducer";
import { getHeroes, getWikiExperienceLevels } from "../Selectors/stateSelectors";
import { translate, translateP } from "../Utilities/I18n";
import { getNewIdByDate } from "../Utilities/IDUtils";
import { pipe_ } from "../Utilities/pipe";
import { ReduxAction } from "./Actions";
import { addAlert } from "./AlertActions";
import { requestAllHeroesSave, requestHeroDeletion, requestHeroExport, requestHeroSave } from "./IOActions";

export interface SetHerolistSortOrderAction {
  type: ActionTypes.SET_HEROLIST_SORT_ORDER
  payload: {
    sortOrder: string;
  }
}

export const setHerolistSortOrder = (sortOrder: string): SetHerolistSortOrderAction => ({
  type: ActionTypes.SET_HEROLIST_SORT_ORDER,
  payload: {
    sortOrder,
  },
})

export interface SetHerolistFilterTextAction {
  type: ActionTypes.SET_HEROLIST_FILTER_TEXT
  payload: {
    filterText: string;
  }
}

export const setHerolistFilterText = (filterText: string): SetHerolistFilterTextAction => ({
  type: ActionTypes.SET_HEROLIST_FILTER_TEXT,
  payload: {
    filterText,
  },
})

export interface SetHerolistVisibilityFilterAction {
  type: ActionTypes.SET_HEROLIST_VISIBILITY_FILTER
  payload: {
    filterOption: string;
  }
}

export const setHerolistVisibilityFilter =
  (filterOption: string): SetHerolistVisibilityFilterAction => ({
    type: ActionTypes.SET_HEROLIST_VISIBILITY_FILTER,
    payload: {
      filterOption,
    },
  })

export interface CreateHeroAction {
  type: ActionTypes.CREATE_HERO
  payload: {
    id: string;
    name: string;
    sex: "m" | "f";
    el: string;
    enableAllRuleBooks: boolean;
    enabledRuleBooks: OrderedSet<string>;
    totalAp: number;
  }
}

export const createHero =
  (name: string) =>
  (sex: "m" | "f") =>
  (el: string) =>
  (enableAllRuleBooks: boolean) =>
  (enabledRuleBooks: OrderedSet<string>): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()

    const maybeSelectedExperienceLevel = lookup (el) (getWikiExperienceLevels (state))

    if (isJust (maybeSelectedExperienceLevel)) {
      const selectedExperienceLevel = fromJust (maybeSelectedExperienceLevel)
      const totalAp = ExperienceLevel.A.ap (selectedExperienceLevel)

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
        },
      })
    }
  }

export interface LoadHeroAction {
  type: ActionTypes.LOAD_HERO
  payload: {
    id: string;
  }
}

export const loadHero = (id: string): LoadHeroAction => ({
  type: ActionTypes.LOAD_HERO,
  payload: {
    id,
  },
})

export const saveHeroes =
  (l10n: L10nRecord): ReduxAction =>
  dispatch => {
    pipe_ (
      dispatch (requestAllHeroesSave (l10n)),
      tryIO,
      fmap (fmap (() => dispatch (addAlert ({
                                   message: translate (l10n) ("allsaved"),
                                 }))))
    )
  }

export interface SaveHeroAction {
  type: ActionTypes.SAVE_HERO
  payload: {
    id: string;
  }
}

export const saveHero =
  (l10n: L10nRecord) =>
  (id: Maybe<string>): ReduxAction =>
    dispatch => {
      pipe_ (
        dispatch (requestHeroSave (l10n) (id)),
        tryIO,
        fmap (fmap (fmap (save_id => dispatch<SaveHeroAction> ({
                                       type: ActionTypes.SAVE_HERO,
                                       payload: {
                                         id: save_id, // specified by param or currently open
                                       },
                                     }))))
      )
    }

export const exportHeroValidate =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction =>
  dispatch =>
    dispatch (requestHeroExport (l10n) (id))

export interface DeleteHeroAction {
  type: ActionTypes.DELETE_HERO
  payload: {
    id: string;
  }
}

export const deleteHero = (id: string): DeleteHeroAction => ({
  type: ActionTypes.DELETE_HERO,
  payload: {
    id,
  },
})

export const deleteHeroValidate =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const heroes = getHeroes (state)
    const mhero = lookup (id) (heroes)

    if (isJust (mhero)) {
      const hero = fromJust (mhero)

      const resolve: ReduxAction = futureDispatch => {
        futureDispatch (deleteHero (id))
        tryIO (futureDispatch (requestHeroDeletion (l10n) (id)))
      }

      // @ts-ignore
      dispatch (addAlert ({
        title: translateP (l10n)
                          ("deletehero")
                          (List (pipe_ (hero, heroReducer.A_.present, HeroModel.A.name))),
        message: translate (l10n) ("deletehero.text"),
        confirm: {
          resolve,
        },
        confirmYesNo: true,
      }))
    }
  }

export interface DuplicateHeroAction {
  type: ActionTypes.DUPLICATE_HERO
  payload: {
    id: string;
    newId: string;
  }
}

export const duplicateHero = (id: string): DuplicateHeroAction => {
  const newId = `H_${getNewIdByDate ()}`

  return {
    type: ActionTypes.DUPLICATE_HERO,
    payload: {
      id,
      newId,
    },
  }
}
