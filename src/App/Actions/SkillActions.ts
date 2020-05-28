import { bind, bindF, fromJust, isNothing, join, liftM2 } from "../../Data/Maybe"
import { lookup } from "../../Data/OrderedMap"
import * as ActionTypes from "../Constants/ActionTypes"
import { SkillsSortOptions } from "../Models/Config"
import { getAvailableAPMap } from "../Selectors/adventurePointsSelectors"
import { getIsInCharacterCreation } from "../Selectors/phaseSelectors"
import { getCurrentHeroPresent, getSkills, getWikiSkills } from "../Selectors/stateSelectors"
import { getAreSufficientAPAvailableForIncrease } from "../Utilities/Increasable/increasableUtils"
import { pipe_ } from "../Utilities/pipe"
import { ReduxAction } from "./Actions"
import { addNotEnoughAPAlert } from "./AlertActions"

export interface AddSkillPointAction {
  type: ActionTypes.ADD_TALENT_POINT
  payload: {
    id: string
  }
}

export const addSkillPoint =
  (id: string): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState ()
    const mhero_skills = getSkills (state)
    const wiki_skills = getWikiSkills (state)
    const mhero = getCurrentHeroPresent (state)

    const missingAPForInc =
      pipe_ (
        mhero,
        bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { hero })),
        join,
        liftM2 (getAreSufficientAPAvailableForIncrease (getIsInCharacterCreation (state))
                                                       (bind (mhero_skills)
                                                             (lookup (id))))
               (lookup (id) (wiki_skills)),
        join
      )

    if (isNothing (missingAPForInc)) {
      dispatch<AddSkillPointAction> ({
        type: ActionTypes.ADD_TALENT_POINT,
        payload: {
          id,
        },
      })
    }
    else {
      await dispatch (addNotEnoughAPAlert (fromJust (missingAPForInc)))
    }
  }

export interface RemoveSkillPointAction {
  type: ActionTypes.REMOVE_TALENT_POINT
  payload: {
    id: string
  }
}

export const removeSkillPoint = (id: string): RemoveSkillPointAction => ({
  type: ActionTypes.REMOVE_TALENT_POINT,
  payload: {
    id,
  },
})

export interface SetSkillsSortOrderAction {
  type: ActionTypes.SET_TALENTS_SORT_ORDER
  payload: {
    sortOrder: SkillsSortOptions
  }
}

export const setSkillsSortOrder = (sortOrder: SkillsSortOptions): SetSkillsSortOrderAction => ({
  type: ActionTypes.SET_TALENTS_SORT_ORDER,
  payload: {
    sortOrder,
  },
})

export interface SwitchSkillRatingVisibilityAction {
  type: ActionTypes.SWITCH_TALENT_RATING_VISIBILITY
}

export const switchSkillRatingVisibility = (): SwitchSkillRatingVisibilityAction => ({
  type: ActionTypes.SWITCH_TALENT_RATING_VISIBILITY,
})

export interface SetSkillsFilterTextAction {
  type: ActionTypes.SET_SKILLS_FILTER_TEXT
  payload: {
    filterText: string
  }
}

export const setSkillsFilterText = (filterText: string): SetSkillsFilterTextAction => ({
  type: ActionTypes.SET_SKILLS_FILTER_TEXT,
  payload: {
    filterText,
  },
})
