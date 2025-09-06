import { fmap, fmapF } from "../../Data/Functor"
import { over, set } from "../../Data/Lens"
import { List, subscriptF, uncons } from "../../Data/List"
import { altF_, bind, bindF, elem, ensure, fromJust, isJust, join, Just, liftM2, Maybe, Nothing } from "../../Data/Maybe"
import { negate, subtract } from "../../Data/Num"
import { lookup } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { fst, Pair, PairP1_, snd } from "../../Data/Tuple"
import * as ActionTypes from "../Constants/ActionTypes"
import { DisadvantageId } from "../Constants/Ids"
import { ActivatableActivationEntryType } from "../Models/Actions/ActivatableActivationEntryType"
import { ActivatableActivationOptions } from "../Models/Actions/ActivatableActivationOptions"
import { ActivatableDeactivationEntryType } from "../Models/Actions/ActivatableDeactivationEntryType"
import { ActivatableDeactivationOptions, ActivatableDeactivationOptionsL } from "../Models/Actions/ActivatableDeactivationOptions"
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent"
import { ActiveObject } from "../Models/ActiveEntries/ActiveObject"
import { ActiveObjectWithIdL, toActiveObjectWithId } from "../Models/ActiveEntries/ActiveObjectWithId"
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel"
import { ActivatableNameCost, ActivatableNameCostSafeCost } from "../Models/View/ActivatableNameCost"
import { Advantage, isAdvantage } from "../Models/Wiki/Advantage"
import { Disadvantage, isDisadvantage } from "../Models/Wiki/Disadvantage"
import { Race } from "../Models/Wiki/Race"
import { RaceVariant } from "../Models/Wiki/RaceVariant"
import { StaticDataRecord } from "../Models/Wiki/WikiModel"
import { getAPObjectMap } from "../Selectors/adventurePointsSelectors"
import { getIsInCharacterCreation } from "../Selectors/phaseSelectors"
import { getAutomaticAdvantages, getRace, getRaceVariant } from "../Selectors/raceSelectors"
import { getCurrentHeroPresent, getWiki } from "../Selectors/stateSelectors"
import { getNameCost } from "../Utilities/Activatable/activatableActiveUtils"
import { isBlessedOrMagical } from "../Utilities/Activatable/checkActivatableUtils"
import { convertPerTierCostToFinalCost } from "../Utilities/AdventurePoints/activatableCostUtils"
import { getDisAdvantagesSubtypeMax, getMissingAPForDisAdvantage, MissingAPForDisAdvantage } from "../Utilities/AdventurePoints/adventurePointsUtils"
import { translate, translateP } from "../Utilities/I18n"
import { pipe, pipe_ } from "../Utilities/pipe"
import { misNumberM } from "../Utilities/typeCheckUtils"
import { getWikiEntry } from "../Utilities/WikiUtils"
import { WikiInfoSelector } from "../Views/InlineWiki/WikiInfo"
import { ReduxAction, ReduxDispatch } from "./Actions"
import { addAlert, addNotEnoughAPAlert, AlertOptions } from "./AlertActions"

/**
 * Advantages and disadvantages might not only be added or removed due to not
 * enough AP but also due to limitations regarding AP spent on advantages,
 * disadvantages or subtypes thereof (blessed, magical). This function ensures
 * that the appropiate error message is displayed if an entry cannot be added or
 * removed.
 *
 * If the addition or removal is valid, the passed `successFn` will be called.
 */
const handleMissingAPForDisAdvantage =
  (static_data: StaticDataRecord) =>
  (success: () => void) =>
  (hero: HeroModelRecord) =>
  (missing_ap: Record<MissingAPForDisAdvantage>) =>
  (is_blessed_or_magical: Pair<boolean, boolean>) =>
  (is_disadvantage: boolean) =>
  async (dispatch: ReduxDispatch) => {
    const totalMissing = MissingAPForDisAdvantage.AL.totalMissing (missing_ap)
    const mainMissing = MissingAPForDisAdvantage.AL.mainMissing (missing_ap)
    const subMissing = MissingAPForDisAdvantage.AL.subMissing (missing_ap)

    if (isJust (totalMissing)) {
      await dispatch (addNotEnoughAPAlert (fromJust (totalMissing)))
    }
    else if (isJust (mainMissing)) {
      const type = is_disadvantage
        ? translate (static_data) ("general.dialogs.reachedaplimit.disadvantages")
        : translate (static_data) ("general.dialogs.reachedaplimit.advantages")

      const opts = AlertOptions ({
        title: Just (translateP (static_data)
                                ("general.dialogs.reachedaplimit.title")
                                (List (type))),
        message: translateP (static_data)
                            ("general.dialogs.reachedaplimit.message")
                            (List<string | number> (fromJust (mainMissing), 80, type)),
      })

      await dispatch (addAlert (opts))
    }
    else if (isJust (subMissing)) {
      const ap = getDisAdvantagesSubtypeMax (snd (is_blessed_or_magical)) (hero)

      const type = is_disadvantage
        ? fst (is_blessed_or_magical)
          ? translate (static_data) ("general.dialogs.reachedaplimit.blesseddisadvantages")
          : translate (static_data) ("general.dialogs.reachedaplimit.magicaldisadvantages")
        : fst (is_blessed_or_magical)
          ? translate (static_data) ("general.dialogs.reachedaplimit.blessedadvantages")
          : translate (static_data) ("general.dialogs.reachedaplimit.magicaladvantages")

      const opts = AlertOptions ({
        title: Just (translateP (static_data)
                                ("general.dialogs.reachedaplimit.title")
                                (List (type))),
        message: translateP (static_data)
                            ("general.dialogs.reachedaplimit.message")
                            (List<string | number> (fromJust (subMissing), ap, type)),
      })

      await dispatch (addAlert (opts))
    }
    else {
      success ()
    }
  }

export interface ActivateDisAdvAction {
  type: ActionTypes.ACTIVATE_DISADV
  payload: {
    args: Record<ActivatableActivationOptions>
    entryType: Record<ActivatableActivationEntryType>
    staticData: StaticDataRecord
  }
}

/**
 * Add an advantage or disadvantage with the provided activation properties
 * (`args`).
 */
export const addDisAdvantage =
  (args: Record<ActivatableActivationOptions>): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState ()
    const static_data = getWiki (state)
    const mhero = getCurrentHeroPresent (state)

    if (isJust (mhero)) {
      const hero = fromJust (mhero)

      const current_id = ActivatableActivationOptions.AL.id (args)
      const current_cost = ActivatableActivationOptions.AL.cost (args)

      const mwiki_entry =
        bind (getWikiEntry (getWiki (state)) (current_id))
             (ensure ((x): x is Record<Advantage> | Record<Disadvantage> =>
                       isAdvantage (x) || isDisadvantage (x)))

      const mhero_entry =
        bind (mwiki_entry)
             (x => lookup (current_id)
                          (isAdvantage (x)
                            ? HeroModel.AL.advantages (hero)
                            : HeroModel.AL.disadvantages (hero)))

      if (isJust (mwiki_entry)) {
        const wiki_entry = fromJust (mwiki_entry)

        const is_disadvantage = isDisadvantage (wiki_entry)

        const entryType = isBlessedOrMagical (wiki_entry)

        const mmissingAPForDisAdvantage =
          fmapF (join (getAPObjectMap (HeroModel.A.id (hero)) (state, { hero })))
                (ap => getMissingAPForDisAdvantage (getIsInCharacterCreation (state))
                                                   (entryType)
                                                   (is_disadvantage)
                                                   (hero)
                                                   (ap)
                                                   (Advantage.AL.id (wiki_entry))
                                                   (current_cost))

        const successFn = () => {
          const color: Pair<Maybe<number>, Maybe<number>> =
            current_id === DisadvantageId.Stigma
              && elem<string | number> (1) (ActivatableActivationOptions.AL.selectOptionId1 (args))

              // (eyeColor, hairColor)
            ? Pair (Just (19), Just (24))
            : current_id === DisadvantageId.Stigma
              && elem<string | number> (3) (ActivatableActivationOptions.AL.selectOptionId1 (args))

              // (eyeColor, hairColor)
            ? Pair (Nothing, Just (25))
            : Pair (Nothing, Nothing)

          dispatch<ActivateDisAdvAction> ({
            type: ActionTypes.ACTIVATE_DISADV,
            payload: {
              args,
              entryType: ActivatableActivationEntryType ({
                eyeColor: fst (color),
                hairColor: snd (color),
                isBlessed: fst (entryType),
                isDisadvantage: is_disadvantage,
                isMagical: snd (entryType),
                heroEntry: mhero_entry,
                wikiEntry: wiki_entry,
              }),
              staticData: static_data,
            },
          })
        }

        if (isJust (mmissingAPForDisAdvantage)) {
          await handleMissingAPForDisAdvantage (static_data)
                                               (successFn)
                                               (hero)
                                               (fromJust (mmissingAPForDisAdvantage))
                                               (entryType)
                                               (is_disadvantage)
                                               (dispatch)
        }
      }
    }
  }

export interface DeactivateDisAdvAction {
  type: ActionTypes.DEACTIVATE_DISADV
  payload: {
    args: Record<ActivatableDeactivationOptions>
    entryType: Record<ActivatableDeactivationEntryType>
    staticData: StaticDataRecord
  }
}

/**
 * Remove an advantage or disadvantage with the provided activation properties
 * (`args`).
 */
export const removeDisAdvantage =
  (args: Record<ActivatableDeactivationOptions>): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState ()
    const static_data = getWiki (state)
    const mhero = getCurrentHeroPresent (state)

    if (isJust (mhero)) {
      const hero = fromJust (mhero)

      const current_id = ActivatableDeactivationOptions.AL.id (args)
      const current_index = ActivatableDeactivationOptions.AL.index (args)
      const current_cost = ActivatableDeactivationOptions.AL.cost (args)

      // the entry should be removed
      const negativeCost = current_cost * -1

      const mwiki_entry =
        bind (getWikiEntry (getWiki (state)) (current_id))
             (ensure ((x): x is Record<Advantage> | Record<Disadvantage> =>
                       isAdvantage (x) || isDisadvantage (x)))

      const mhero_entry =
        bind (mwiki_entry)
             (x => lookup (current_id)
                          (isAdvantage (x)
                            ? HeroModel.AL.advantages (hero)
                            : HeroModel.AL.disadvantages (hero)))

      if (isJust (mwiki_entry) && isJust (mhero_entry)) {
        const wiki_entry = fromJust (mwiki_entry)
        const hero_entry = fromJust (mhero_entry)

        const is_disadvantage = isDisadvantage (wiki_entry)

        const entryType = isBlessedOrMagical (wiki_entry)

        const mmissingAPForDisAdvantage =
          fmapF (join (getAPObjectMap (HeroModel.A.id (hero)) (state, { hero })))
                (ap => getMissingAPForDisAdvantage (getIsInCharacterCreation (state))
                                                   (entryType)
                                                   (is_disadvantage)
                                                   (hero)
                                                   (ap)
                                                   (Advantage.AL.id (wiki_entry))
                                                   (negativeCost))

        const successFn = () => {
          const color: Maybe<Pair<number, number>> =
            current_id === DisadvantageId.Stigma
            && Maybe.any (List.elemF (List (1, 3)))
                         (pipe_ (
                           hero_entry,
                           ActivatableDependent.A.active,
                           subscriptF (current_index),
                           bindF (ActiveObject.A.sid),
                           misNumberM
                         ))
              ? bind (getRace (state, { hero }))
                     (race => {
                       const mrace_var = getRaceVariant (state, { hero })

                       const p = Pair (
                         pipe (
                                Race.A.eyeColors,
                                altF_ (() => fmapF (mrace_var) (RaceVariant.A.eyeColors)),
                                bindF (uncons),
                                fmap<Pair<number, List<number>>, number> (fst)
                              )
                              (race),
                         pipe (
                                Race.A.hairColors,
                                altF_ (() => fmapF (mrace_var) (RaceVariant.A.hairColors)),
                                bindF (uncons),
                                fmap<Pair<number, List<number>>, number> (fst)
                              )
                              (race)
                       )

                       return liftM2 (Pair as PairP1_) <number, number> (fst (p)) (snd (p))
                     })
              : Nothing

          dispatch<DeactivateDisAdvAction> ({
            type: ActionTypes.DEACTIVATE_DISADV,
            payload: {
              args: over (ActivatableDeactivationOptionsL.cost) (negate) (args),
              entryType: ActivatableDeactivationEntryType ({
                eyeColor: fmapF (color) (fst),
                hairColor: fmapF (color) (snd),
                isBlessed: fst (entryType),
                isDisadvantage: is_disadvantage,
                isMagical: snd (entryType),
                heroEntry: hero_entry,
                wikiEntry: wiki_entry,
              }),
              staticData: static_data,
            },
          })
        }

        if (isJust (mmissingAPForDisAdvantage)) {
          await handleMissingAPForDisAdvantage (static_data)
                                               (successFn)
                                               (hero)
                                               (fromJust (mmissingAPForDisAdvantage))
                                               (entryType)
                                               (is_disadvantage)
                                               (dispatch)
        }
      }
    }
  }

export interface SetDisAdvLevelAction {
  type: ActionTypes.SET_DISADV_TIER
  payload: Pair<
    { id: string; index: number; tier: number },
    Record<ActivatableDeactivationEntryType>
  >
}

/**
 * Change the current level of an advantage or disadvantage.
 */
export const setDisAdvantageLevel =
  (current_id: string) =>
  (current_index: number) =>
  (next_level: number): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState ()
    const static_data = getWiki (state)
    const mhero = getCurrentHeroPresent (state)

    if (isJust (mhero)) {
      const hero = fromJust (mhero)

      const mwiki_entry =
        bind (getWikiEntry (getWiki (state)) (current_id))
             (ensure ((x): x is Record<Advantage> | Record<Disadvantage> =>
                       isAdvantage (x) || isDisadvantage (x)))

      const mhero_entry =
        bind (mwiki_entry)
             (x => lookup (current_id)
                          (isAdvantage (x)
                            ? HeroModel.AL.advantages (hero)
                            : HeroModel.AL.disadvantages (hero)))

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

        const getCostBorder =
          (isEntryToAdd: boolean) =>
            pipe (
              getNameCost (isEntryToAdd)
                          (getAutomaticAdvantages (state, { hero }))
                          (static_data)
                          (hero),
              fmap (pipe (
                convertPerTierCostToFinalCost (true) (static_data),
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

          const is_disadvantage = isDisadvantage (wiki_entry)

          const entryType = isBlessedOrMagical (wiki_entry)

          const mmissingAPForDisAdvantage =
            fmapF (join (getAPObjectMap (HeroModel.A.id (hero)) (state, { hero })))
                  (ap => getMissingAPForDisAdvantage (getIsInCharacterCreation (state))
                                                     (entryType)
                                                     (is_disadvantage)
                                                     (hero)
                                                     (ap)
                                                     (Advantage.AL.id (wiki_entry))
                                                     (diff_cost))

          const successFn = () => {
            dispatch<SetDisAdvLevelAction> ({
              type: ActionTypes.SET_DISADV_TIER,
              payload:
                Pair (
                  {
                    id: current_id,
                    tier: next_level,
                    index: current_index,
                  },
                  ActivatableDeactivationEntryType ({
                    eyeColor: Nothing,
                    hairColor: Nothing,
                    isBlessed: fst (entryType),
                    isDisadvantage: is_disadvantage,
                    isMagical: snd (entryType),
                    heroEntry: fromJust (mhero_entry),
                    wikiEntry: wiki_entry,
                  })
                ),
            })
          }

          if (isJust (mmissingAPForDisAdvantage)) {
            await handleMissingAPForDisAdvantage (static_data)
                                                 (successFn)
                                                 (hero)
                                                 (fromJust (mmissingAPForDisAdvantage))
                                                 (entryType)
                                                 (is_disadvantage)
                                                 (dispatch)
          }
        }
      }
    }
  }

export interface SwitchDisAdvRatingVisibilityAction {
  type: ActionTypes.SWITCH_DISADV_RATING_VISIBILITY
}

export const switchRatingVisibility = (): SwitchDisAdvRatingVisibilityAction => ({
  type: ActionTypes.SWITCH_DISADV_RATING_VISIBILITY,
})

export const setRule = (selector: WikiInfoSelector, rule: string): SaveRuleAction => ({
  type: ActionTypes.SET_CUSTOM_RULE,
  payload: {
    rule,
    selector,
  },
})

export interface SetActiveAdvantagesFilterTextAction {
  type: ActionTypes.SET_ADVANTAGES_FILTER_TEXT
  payload: {
    filterText: string
  }
}

export const setActiveAdvantagesFilterText =
  (filterText: string): SetActiveAdvantagesFilterTextAction => ({
    type: ActionTypes.SET_ADVANTAGES_FILTER_TEXT,
    payload: {
      filterText,
    },
  })

export interface SetInactiveAdvantagesFilterTextAction {
  type: ActionTypes.SET_INAC_ADVANTAGES_FILTER_TEXT
  payload: {
    filterText: string
  }
}

export const setInactiveAdvantagesFilterText =
  (filterText: string): SetInactiveAdvantagesFilterTextAction => ({
    type: ActionTypes.SET_INAC_ADVANTAGES_FILTER_TEXT,
    payload: {
      filterText,
    },
  })

export interface SetActiveDisadvantagesFilterTextAction {
  type: ActionTypes.SET_DISADVANTAGES_FILTER_TEXT
  payload: {
    filterText: string
  }
}

export const setActiveDisadvantagesFilterText =
  (filterText: string): SetActiveDisadvantagesFilterTextAction => ({
    type: ActionTypes.SET_DISADVANTAGES_FILTER_TEXT,
    payload: {
      filterText,
    },
  })

export interface SetInactiveDisadvantagesFilterTextAction {
  type: ActionTypes.SET_INAC_DISADVANTAGES_FILTER_TEXT
  payload: {
    filterText: string
  }
}

export const setInactiveDisadvantagesFilterText =
  (filterText: string): SetInactiveDisadvantagesFilterTextAction => ({
    type: ActionTypes.SET_INAC_DISADVANTAGES_FILTER_TEXT,
    payload: {
      filterText,
    },
  })

export interface SaveRuleAction {
  type: ActionTypes.SET_CUSTOM_RULE
  payload: {
    rule: string
    selector: WikiInfoSelector
  }
}
