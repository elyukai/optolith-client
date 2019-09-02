import { fmap } from "../../Data/Functor";
import { set } from "../../Data/Lens";
import { List, subscriptF } from "../../Data/List";
import { bind, bindF, ensure, fromJust, isJust, isNothing, join, Just, liftM2, Maybe } from "../../Data/Maybe";
import { subtract } from "../../Data/Num";
import { lookup } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { Pair } from "../../Data/Tuple";
import { ActionTypes } from "../Constants/ActionTypes";
import { ActivatableActivationOptions } from "../Models/Actions/ActivatableActivationOptions";
import { ActivatableDeactivationOptions } from "../Models/Actions/ActivatableDeactivationOptions";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { ActiveObjectWithIdL, toActiveObjectWithId } from "../Models/ActiveEntries/ActiveObjectWithId";
import { HeroModel } from "../Models/Hero/HeroModel";
import { ActivatableNameCost, ActivatableNameCostSafeCost } from "../Models/View/ActivatableNameCost";
import { L10nRecord } from "../Models/Wiki/L10n";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { getAvailableAPMap } from "../Selectors/adventurePointsSelectors";
import { getIsInCharacterCreation } from "../Selectors/phaseSelectors";
import { getAutomaticAdvantages } from "../Selectors/rcpSelectors";
import { getCurrentHeroPresent, getWiki } from "../Selectors/stateSelectors";
import { getNameCost } from "../Utilities/Activatable/activatableActiveUtils";
import { convertPerTierCostToFinalCost } from "../Utilities/AdventurePoints/activatableCostUtils";
import { getMissingAP } from "../Utilities/AdventurePoints/adventurePointsUtils";
import { translate, translateP } from "../Utilities/I18n";
import { pipe, pipe_ } from "../Utilities/pipe";
import { getWikiEntry } from "../Utilities/WikiUtils";
import { SortNames } from "../Views/Universal/SortOptions";
import { ReduxAction } from "./Actions";
import { addAlert } from "./AlertActions";

export interface ActivateSpecialAbilityAction {
  type: ActionTypes.ACTIVATE_SPECIALABILITY
  payload: Pair<
    Record<ActivatableActivationOptions>,
    Pair<Record<SpecialAbility>, Maybe<Record<ActivatableDependent>>>
  >
}

/**
 * Add a special ability with the provided activation properties (`args`).
 */
export const addSpecialAbility =
  (l10n: L10nRecord) =>
  (args: Record<ActivatableActivationOptions>): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()

    const mhero = getCurrentHeroPresent (state)

    if (isJust (mhero)) {
      const current_id = ActivatableActivationOptions.AL.id (args)
      const current_cost = ActivatableActivationOptions.AL.cost (args)

      const mwiki_entry =
        bind (getWikiEntry (getWiki (state)) (current_id))
             (ensure (SpecialAbility.is))

      const mhero_entry =
        lookup (current_id)
               (HeroModel.AL.specialAbilities (fromJust (mhero)))

      if (isJust (mwiki_entry)) {
        const wiki_entry = fromJust (mwiki_entry)

        const mmissingAP =
          pipe_ (
            mhero,
            bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { l10n, hero })),
            join,
            bindF (getMissingAP (getIsInCharacterCreation (state))
                                (current_cost))
          )

        if (isNothing (mmissingAP)) {
          dispatch<ActivateSpecialAbilityAction> ({
            type: ActionTypes.ACTIVATE_SPECIALABILITY,
            payload: Pair (args, Pair (wiki_entry, mhero_entry)),
          })
        }
        else {
          dispatch (addAlert ({
            title: translate (l10n) ("notenoughap"),
            message: translateP (l10n) ("notenoughap.text") (List (fromJust (mmissingAP))),
          }))
        }
      }
    }
  }

export interface DeactivateSpecialAbilityAction {
  type: ActionTypes.DEACTIVATE_SPECIALABILITY
  payload: Pair<
    Record<ActivatableDeactivationOptions>,
    Pair<Record<SpecialAbility>, Record<ActivatableDependent>>
  >
}

/**
 * Remove a special ability with the provided activation properties
 * (`args`).
 */
export const removeSpecialAbility =
  (args: Record<ActivatableDeactivationOptions>): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()

    const mhero = getCurrentHeroPresent (state)

    if (isJust (mhero)) {
      const hero = fromJust (mhero)

      const current_id = ActivatableDeactivationOptions.AL.id (args)

      const mwiki_entry =
        bind (getWikiEntry (getWiki (state)) (current_id))
             (ensure (SpecialAbility.is))

      const mhero_entry =
        lookup (current_id)
               (HeroModel.AL.specialAbilities (hero))

      if (isJust (mwiki_entry) && isJust (mhero_entry)) {
        const wiki_entry = fromJust (mwiki_entry)
        const hero_entry = fromJust (mhero_entry)

        dispatch<DeactivateSpecialAbilityAction> ({
          type: ActionTypes.DEACTIVATE_SPECIALABILITY,
          payload: Pair (args, Pair (wiki_entry, hero_entry)),
        })
      }
    }
  }

export interface SetSpecialAbilityTierAction {
  type: ActionTypes.SET_SPECIALABILITY_TIER
  payload: Pair<
    { id: string; index: number; tier: number },
    Pair<Record<SpecialAbility>, Record<ActivatableDependent>>
  >
}

/**
 * Change the current level of a special ability.
 */
export const setSpecialAbilityLevel =
  (l10n: L10nRecord) =>
  (current_id: string) =>
  (current_index: number) =>
  (next_level: number): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()

    const mhero = getCurrentHeroPresent (state)

    if (isJust (mhero)) {
      const hero = fromJust (mhero)

      const mwiki_entry =
        bind (getWikiEntry (getWiki (state)) (current_id))
             (ensure (SpecialAbility.is))

      const mhero_entry =
        lookup (current_id)
               (HeroModel.AL.specialAbilities (hero))

      const mactive_entry =
        pipe (
               bindF (pipe (
                             ActivatableDependent.A.active,
                             subscriptF (current_index)
                           )),
               fmap (toActiveObjectWithId (current_index) (current_id))
             )
             (mhero_entry)

      if (isJust (mwiki_entry) && isJust (mhero_entry) && isJust (mactive_entry)) {
        const wiki_entry = fromJust (mwiki_entry)
        const active_entry = fromJust (mactive_entry)

        const wiki = getWiki (state)

        const getCostBorder =
          (isEntryToAdd: boolean) =>
            pipe (
              getNameCost (isEntryToAdd)
                          (getAutomaticAdvantages (state, { hero }))
                          (l10n)
                          (wiki)
                          (hero),
              fmap (pipe (
                convertPerTierCostToFinalCost (true) (l10n),
                ActivatableNameCost.A.finalCost as
                  (x: Record<ActivatableNameCostSafeCost>) => number
              ))
            )

        const previousCost =
          getCostBorder (false) (active_entry)

        const nextCost =
          getCostBorder (true) (set (ActiveObjectWithIdL.tier)
                                    (Just (next_level))
                                    (active_entry))

        const mdiff_cost = liftM2 (subtract) (nextCost) (previousCost)

        if (isJust (mdiff_cost)) {
          const diff_cost = fromJust (mdiff_cost)

          const mmissingAP =
            pipe_ (
              getAvailableAPMap (HeroModel.A.id (hero)) (state, { l10n, hero }),
              join,
              bindF (getMissingAP (getIsInCharacterCreation (state))
                                  (diff_cost))
            )


          if (isNothing (mmissingAP)) {
            dispatch<SetSpecialAbilityTierAction> ({
              type: ActionTypes.SET_SPECIALABILITY_TIER,
              payload: Pair (
                {
                  id: current_id,
                  tier: next_level,
                  index: current_index,
                },
                Pair (wiki_entry, fromJust (mhero_entry))
              ),
            })
          }
          else {
            dispatch (addAlert ({
              title: translate (l10n) ("notenoughap"),
              message: translateP (l10n) ("notenoughap.text") (List (fromJust (mmissingAP))),
            }))
          }
        }
      }
    }
  }

export interface SetSpecialAbilitiesSortOrderAction {
  type: ActionTypes.SET_SPECIALABILITIES_SORT_ORDER
  payload: {
    sortOrder: SortNames;
  }
}

export const setSpecialAbilitiesSortOrder =
  (sortOrder: SortNames): SetSpecialAbilitiesSortOrderAction => ({
    type: ActionTypes.SET_SPECIALABILITIES_SORT_ORDER,
    payload: {
      sortOrder,
    },
  })

export interface SetActiveSpecialAbilitiesFilterTextAction {
  type: ActionTypes.SET_SPECIAL_ABILITIES_FILTER_TEXT
  payload: {
    filterText: string;
  }
}

export const setActiveSpecialAbilitiesFilterText =
  (filterText: string): SetActiveSpecialAbilitiesFilterTextAction => ({
    type: ActionTypes.SET_SPECIAL_ABILITIES_FILTER_TEXT,
    payload: {
      filterText,
    },
  })

export interface SetInactiveSpecialAbilitiesFilterTextAction {
  type: ActionTypes.SET_INACTIVE_SPECIAL_ABILITIES_FILTER_TEXT
  payload: {
    filterText: string;
  }
}

export const setInactiveSpecialAbilitiesFilterText =
  (filterText: string): SetInactiveSpecialAbilitiesFilterTextAction => ({
    type: ActionTypes.SET_INACTIVE_SPECIAL_ABILITIES_FILTER_TEXT,
    payload: {
      filterText,
    },
  })

export interface SetGuildMageUnfamiliarSpellIdAction {
  type: ActionTypes.SET_TRADITION_GUILD_MAGE_UNFAMILIAR_SPELL_ID
  payload: {
    id: string;
  }
}

export const setGuildMageUnfamiliarSpellId = (id: string): SetGuildMageUnfamiliarSpellIdAction => ({
  type: ActionTypes.SET_TRADITION_GUILD_MAGE_UNFAMILIAR_SPELL_ID,
  payload: {
    id,
  },
})
