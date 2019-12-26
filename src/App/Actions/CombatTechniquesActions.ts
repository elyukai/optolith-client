import { List } from "../../Data/List";
import { bind, bindF, fromJust, isNothing, join, Just, liftM2 } from "../../Data/Maybe";
import { lookup } from "../../Data/OrderedMap";
import * as ActionTypes from "../Constants/ActionTypes";
import { HeroModel } from "../Models/Hero/HeroModel";
import { L10nRecord } from "../Models/Wiki/L10n";
import { getAvailableAPMap } from "../Selectors/adventurePointsSelectors";
import { getIsInCharacterCreation } from "../Selectors/phaseSelectors";
import { getCombatTechniques, getCurrentHeroPresent, getWikiCombatTechniques } from "../Selectors/stateSelectors";
import { translate, translateP } from "../Utilities/I18n";
import { getAreSufficientAPAvailableForIncrease } from "../Utilities/Increasable/increasableUtils";
import { pipe_ } from "../Utilities/pipe";
import { CombatTechniquesSortOptions } from "../Utilities/Raw/JSON/Config";
import { ReduxAction } from "./Actions";
import { addAlert, AlertOptions } from "./AlertActions";

export interface AddCombatTechniquePointAction {
  type: ActionTypes.ADD_COMBATTECHNIQUE_POINT
  payload: {
    id: string;
  }
}

export const addCombatTechniquePoint =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState ()
    const mhero_combat_techniques = getCombatTechniques (state)
    const wiki_combat_techniques = getWikiCombatTechniques (state)
    const mhero = getCurrentHeroPresent (state)

    const missingAPForInc =
      pipe_ (
        mhero,
        bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { l10n, hero })),
        join,
        liftM2 (getAreSufficientAPAvailableForIncrease (getIsInCharacterCreation (state))
                                                       (bind (mhero_combat_techniques)
                                                             (lookup (id))))
               (lookup (id) (wiki_combat_techniques)),
        join
      )

    if (isNothing (missingAPForInc)) {
      dispatch<AddCombatTechniquePointAction> ({
        type: ActionTypes.ADD_COMBATTECHNIQUE_POINT,
        payload: {
          id,
        },
      })
    }
    else {
      const opts = AlertOptions ({
        title: Just (translate (l10n) ("notenoughap")),
        message: translateP (l10n) ("notenoughap.text") (List (fromJust (missingAPForInc))),
      })

      await dispatch (addAlert (l10n) (opts))
    }
  }

export interface RemoveCombatTechniquePointAction {
  type: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT
  payload: {
    id: string;
  }
}

export const removeCombatTechniquePoint = (id: string): RemoveCombatTechniquePointAction => ({
  type: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT,
  payload: {
    id,
  },
})

export interface SetCombatTechniquesSortOrderAction {
  type: ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER
  payload: {
    sortOrder: CombatTechniquesSortOptions;
  }
}

export const setCombatTechniquesSortOrder =
  (sortOrder: CombatTechniquesSortOptions): SetCombatTechniquesSortOrderAction => ({
    type: ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER,
    payload: {
      sortOrder,
    },
  })

export interface SetCombatTechniquesFilterTextAction {
  type: ActionTypes.SET_COMBAT_TECHNIQUES_FILTER_TEXT
  payload: {
    filterText: string;
  }
}

export const setCombatTechniquesFilterText =
  (filterText: string): SetCombatTechniquesFilterTextAction => ({
    type: ActionTypes.SET_COMBAT_TECHNIQUES_FILTER_TEXT,
    payload: {
      filterText,
    },
  })
