import { List } from "../../Data/List";
import { bind, bindF, fromJust, isJust, isNothing, join, liftM2 } from "../../Data/Maybe";
import { lookup } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { ActionTypes } from "../Constants/ActionTypes";
import { L10nRecord } from "../Models/Wiki/L10n";
import { Spell } from "../Models/Wiki/Spell";
import { getAvailableAdventurePoints } from "../Selectors/adventurePointsSelectors";
import { getIsInCharacterCreation } from "../Selectors/phaseSelectors";
import { getSpells, getWikiSpells } from "../Selectors/stateSelectors";
import { getMissingAP } from "../Utilities/AdventurePoints/adventurePointsUtils";
import { getICMultiplier } from "../Utilities/AdventurePoints/improvementCostUtils";
import { translate, translateP } from "../Utilities/I18n";
import { getAreSufficientAPAvailableForIncrease } from "../Utilities/Increasable/increasableUtils";
import { pipe_ } from "../Utilities/pipe";
import { ReduxAction } from "./Actions";
import { addAlert } from "./AlertActions";

export interface ActivateSpellAction {
  type: ActionTypes.ACTIVATE_SPELL
  payload: {
    id: string;
    wikiEntry: Record<Spell>;
  }
}

export const addSpell =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const wiki_spells = getWikiSpells (state)

    const mwiki_spell = lookup (id) (wiki_spells)

    if (isJust (mwiki_spell)) {
      const wiki_entry = fromJust (mwiki_spell)

      const missingAPForInc =
        bindF (getMissingAP (getIsInCharacterCreation (state))
                            (pipe_ (wiki_entry, Spell.A_.ic, getICMultiplier)))
              (getAvailableAdventurePoints (state, { l10n }))

      if (isNothing (missingAPForInc)) {
        dispatch<ActivateSpellAction> ({
          type: ActionTypes.ACTIVATE_SPELL,
          payload: {
            id,
            wikiEntry: wiki_entry,
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
  }

export interface ActivateCantripAction {
  type: ActionTypes.ACTIVATE_CANTRIP
  payload: {
    id: string;
  }
}

export const addCantrip =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()

    const missingAP =
      bindF (getMissingAP (getIsInCharacterCreation (state))
                          (1))
            (getAvailableAdventurePoints (state, { l10n }))

    if (isNothing (missingAP)) {
      dispatch<ActivateCantripAction> ({
        type: ActionTypes.ACTIVATE_CANTRIP,
        payload: {
          id,
        },
      })
    }
    else {
      dispatch (addAlert ({
        title: translate (l10n) ("notenoughap"),
        message: translateP (l10n) ("notenoughap.text") (List (fromJust (missingAP))),
      }))
    }
  }

export interface DeactivateSpellAction {
  type: ActionTypes.DEACTIVATE_SPELL
  payload: {
    id: string;
    wikiEntry: Record<Spell>;
  }
}

export const removeSpell =
  (id: string): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const wiki_spells = getWikiSpells (state)

    const mwiki_spell = lookup (id) (wiki_spells)

    if (isJust (mwiki_spell)) {
      const wiki_entry = fromJust (mwiki_spell)

      dispatch<DeactivateSpellAction> ({
        type: ActionTypes.DEACTIVATE_SPELL,
        payload: {
          id,
          wikiEntry: wiki_entry,
        },
      })
    }
  }

export interface DeactivateCantripAction {
  type: ActionTypes.DEACTIVATE_CANTRIP
  payload: {
    id: string;
  }
}

export const removeCantrip = (id: string): DeactivateCantripAction => ({
  type: ActionTypes.DEACTIVATE_CANTRIP,
  payload: {
    id,
  },
})

export interface AddSpellPointAction {
  type: ActionTypes.ADD_SPELL_POINT
  payload: {
    id: string;
  }
}

export const addSpellPoint =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const mhero_spells = getSpells (state)
    const wiki_spells = getWikiSpells (state)

    const missingAPForInc =
      join (liftM2 (getAreSufficientAPAvailableForIncrease (getIsInCharacterCreation (state))
                                                           (bind (mhero_spells)
                                                                 (lookup (id))))
                   (lookup (id) (wiki_spells))
                   (getAvailableAdventurePoints (state, { l10n })))

    if (isNothing (missingAPForInc)) {
      dispatch<AddSpellPointAction> ({
        type: ActionTypes.ADD_SPELL_POINT,
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

export interface RemoveSpellPointAction {
  type: ActionTypes.REMOVE_SPELL_POINT
  payload: {
    id: string;
  }
}

export const removeSpellPoint = (id: string): RemoveSpellPointAction => ({
  type: ActionTypes.REMOVE_SPELL_POINT,
  payload: {
    id,
  },
})

export interface SetSpellsSortOrderAction {
  type: ActionTypes.SET_SPELLS_SORT_ORDER
  payload: {
    sortOrder: string;
  }
}

export const setSpellsSortOrder = (sortOrder: string): SetSpellsSortOrderAction => ({
  type: ActionTypes.SET_SPELLS_SORT_ORDER,
  payload: {
    sortOrder,
  },
})

export interface SetActiveSpellsFilterTextAction {
  type: ActionTypes.SET_SPELLS_FILTER_TEXT
  payload: {
    filterText: string;
  }
}

export const setActiveSpellsFilterText = (filterText: string): SetActiveSpellsFilterTextAction => ({
  type: ActionTypes.SET_SPELLS_FILTER_TEXT,
  payload: {
    filterText,
  },
})

export interface SetInactiveSpellsFilterTextAction {
  type: ActionTypes.SET_INACTIVE_SPELLS_FILTER_TEXT
  payload: {
    filterText: string;
  }
}

export const setInactiveSpellsFilterText =
  (filterText: string): SetInactiveSpellsFilterTextAction => ({
    type: ActionTypes.SET_INACTIVE_SPELLS_FILTER_TEXT,
    payload: {
      filterText,
    },
  })
