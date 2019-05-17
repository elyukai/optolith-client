import { List } from "../../Data/List";
import { bind, bindF, fromJust, isNothing, join, liftM2 } from "../../Data/Maybe";
import { lookup } from "../../Data/OrderedMap";
import { ActionTypes } from "../Constants/ActionTypes";
import { HeroModel } from "../Models/Hero/HeroModel";
import { L10nRecord } from "../Models/Wiki/L10n";
import { getAvailableAPMap } from "../Selectors/adventurePointsSelectors";
import { getIsInCharacterCreation } from "../Selectors/phaseSelectors";
import { getCurrentHeroPresent, getSkills, getWikiSkills } from "../Selectors/stateSelectors";
import { translate, translateP } from "../Utilities/I18n";
import { getAreSufficientAPAvailableForIncrease } from "../Utilities/Increasable/increasableUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { ReduxAction } from "./Actions";
import { addAlert } from "./AlertActions";

export interface AddSkillPointAction {
  type: ActionTypes.ADD_TALENT_POINT
  payload: {
    id: string;
  }
}

export const addSkillPoint =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const mhero_skills = getSkills (state)
    const wiki_skills = getWikiSkills (state)
    const mhero = getCurrentHeroPresent (state)

    const missingAPForInc =
      pipe_ (
        mhero,
        bindF (pipe (HeroModel.A.id, hero_id => getAvailableAPMap (hero_id) (state, { l10n }))),
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
      dispatch (addAlert ({
        title: translate (l10n) ("notenoughap"),
        message: translateP (l10n) ("notenoughap.text") (List (fromJust (missingAPForInc))),
      }))
    }
  }

export interface RemoveSkillPointAction {
  type: ActionTypes.REMOVE_TALENT_POINT
  payload: {
    id: string;
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
    sortOrder: string;
  }
}

export const setSkillsSortOrder = (sortOrder: string): SetSkillsSortOrderAction => ({
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
    filterText: string;
  }
}

export const setSkillsFilterText = (filterText: string): SetSkillsFilterTextAction => ({
  type: ActionTypes.SET_SKILLS_FILTER_TEXT,
  payload: {
    filterText,
  },
})
