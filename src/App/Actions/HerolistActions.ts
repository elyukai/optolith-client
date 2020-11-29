import { handleE } from "../../Control/Exception"
import { Either, fromLeft_, fromRight_, isLeft, isRight } from "../../Data/Either"
import { List } from "../../Data/List"
import { elem, fromJust, isJust, Just, Maybe } from "../../Data/Maybe"
import { lookup } from "../../Data/OrderedMap"
import { OrderedSet } from "../../Data/OrderedSet"
import { bind } from "../../System/IO"
import * as ActionTypes from "../Constants/ActionTypes"
import { HeroListSortOptions, HeroListVisibilityFilter } from "../Models/Config"
import { getInitialHeroObject, HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel"
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel"
import { heroReducer } from "../Reducers/heroReducer"
import { getHeroes, getWiki, getWikiExperienceLevels } from "../Selectors/stateSelectors"
import { translate, translateP } from "../Utilities/I18n"
import { getNewIdByDate } from "../Utilities/IDUtils"
import { pipe_ } from "../Utilities/pipe"
import { ReduxAction } from "./Actions"
import { addAlert, addConfirm, addErrorAlert, AlertOptions, ConfirmOptions, ConfirmResponse } from "./AlertActions"
import { requestAllHeroesSave, requestHeroDeletion, requestHeroExport, requestHeroExportAsRptok, requestHeroSave } from "./IOActions"

export interface SetHerolistSortOrderAction {
  type: ActionTypes.SET_HEROLIST_SORT_ORDER
  payload: {
    sortOrder: HeroListSortOptions
  }
}

export const setHerolistSortOrder =
  (sortOrder: HeroListSortOptions): SetHerolistSortOrderAction => ({
    type: ActionTypes.SET_HEROLIST_SORT_ORDER,
    payload: {
      sortOrder,
    },
  })

export interface SetHerolistFilterTextAction {
  type: ActionTypes.SET_HEROLIST_FILTER_TEXT
  payload: {
    filterText: string
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
    filterOption: HeroListVisibilityFilter
  }
}

export const setHerolistVisibilityFilter =
  (filterOption: HeroListVisibilityFilter): SetHerolistVisibilityFilterAction => ({
    type: ActionTypes.SET_HEROLIST_VISIBILITY_FILTER,
    payload: {
      filterOption,
    },
  })

export interface CreateHeroAction {
  type: ActionTypes.CREATE_HERO
  payload: {
    newHero: HeroModelRecord
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

      const newId = `H_${getNewIdByDate ()}`

      const newHero = getInitialHeroObject (getWiki (state))
                                           (newId)
                                           (name)
                                           (sex)
                                           (el)
                                           (totalAp)
                                           (enableAllRuleBooks)
                                           (enabledRuleBooks)

      dispatch<CreateHeroAction> ({
        type: ActionTypes.CREATE_HERO,
        payload: {
          newHero,
        },
      })
    }
  }

export interface LoadHeroAction {
  type: ActionTypes.LOAD_HERO
  payload: {
    id: string
  }
}

export const loadHero = (id: string): LoadHeroAction => ({
  type: ActionTypes.LOAD_HERO,
  payload: {
    id,
  },
})

export const saveHeroes: ReduxAction =
  async (dispatch, getState) => {
    await bind (handleE (dispatch (requestAllHeroesSave)))
               (async res => isRight (res)
                             ? dispatch (addAlert (AlertOptions ({
                                                    message: translate (getWiki (getState ()))
                                                                       ("header.dialogs.allsaved"),
                                                  })))
                             : Promise.resolve ())
  }

export interface SaveHeroAction {
  type: ActionTypes.SAVE_HERO
  payload: {
    id: string
  }
}

export const saveHero =
  (id: Maybe<string>): ReduxAction<Promise<void>> =>
    async (dispatch, getState) => {
      await bind (handleE (dispatch (requestHeroSave (id))))
                 (async res => {
                   if (isLeft (res)) {
                     const err = fromLeft_ (res)

                     const title = translate (getWiki (getState ()))
                                             ("header.dialogs.saveheroeserror.title")

                     const opts = AlertOptions ({
                                    title: Just (title),
                                    message: err .toString (),
                                  })

                     await dispatch (addErrorAlert (opts))
                   }
                   else if (Either.any (isJust) (res)) {
                     const save_id = fromJust (fromRight_ (res))

                     dispatch<SaveHeroAction> ({
                       type: ActionTypes.SAVE_HERO,
                       payload: {
                         // specified by param or currently open
                         id: save_id,
                       },
                     })
                   }
                 })
    }

export const exportHeroAsRptok =
  (id: string): ReduxAction =>
  dispatch =>
    dispatch (requestHeroExportAsRptok (id))

export const exportHeroValidate =
  (id: string): ReduxAction =>
  dispatch =>
    dispatch (requestHeroExport (id))

export interface DeleteHeroAction {
  type: ActionTypes.DELETE_HERO
  payload: {
    id: string
  }
}

const deleteHero = (id: string): DeleteHeroAction => ({
  type: ActionTypes.DELETE_HERO,
  payload: {
    id,
  },
})

export const deleteHeroValidate =
  (id: string): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState ()
    const staticData = getWiki (state)
    const heroes = getHeroes (state)
    const mhero = lookup (id) (heroes)

    if (isJust (mhero)) {
      const hero = fromJust (mhero)

      const opts = ConfirmOptions ({
        title: Just (translateP (staticData)
                                ("heroes.dialogs.deletehero.title")
                                (List (pipe_ (hero, heroReducer.A.present, HeroModel.A.name)))),
        message: translate (staticData) ("heroes.dialogs.deletehero.message"),
        useYesNo: true,
      })

      const res = await dispatch (addConfirm (staticData) (opts))

      if (elem (ConfirmResponse.Accepted) (res)) {
        dispatch (deleteHero (id))
        await handleE (dispatch (requestHeroDeletion (id)))
      }
    }
  }

export interface DuplicateHeroAction {
  type: ActionTypes.DUPLICATE_HERO
  payload: {
    id: string
    newId: string
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

export interface UpdateDateModifiedAction {
  type: ActionTypes.UPDATE_DATE_MODIFIED
  payload: {
    id: string
    dateModified: Date
  }
}

export const updateDateModified = (id: string): UpdateDateModifiedAction => {
  const dateModified = new Date ()

  return {
    type: ActionTypes.UPDATE_DATE_MODIFIED,
    payload: {
      id,
      dateModified,
    },
  }
}
