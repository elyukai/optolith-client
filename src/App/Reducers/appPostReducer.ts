import { notP } from "../../Data/Bool";
import { flip, ident, join } from "../../Data/Function";
import { fmapF } from "../../Data/Functor";
import { over, set } from "../../Data/Lens";
import { consF, List, notElem } from "../../Data/List";
import { and, elem, fromJust, isJust, isNothing, Just, or } from "../../Data/Maybe";
import { insert, OrderedMap } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { fst, snd, uncurry } from "../../Data/Tuple";
import { uncurry3 } from "../../Data/Tuple/Curry";
import { RedoAction, UndoAction } from "../Actions/HistoryActions";
import { ReceiveImportedHeroAction, ReceiveInitialDataAction } from "../Actions/IOActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel";
import { Alert, User } from "../Models/Hero/heroTypeHelpers";
import { getRuleBooksEnabledM } from "../Selectors/rulesSelectors";
import { getCurrentCultureId, getCurrentHeroPresent, getCurrentRaceId, getCurrentTab, getLocaleMessages, getPhase, getWiki } from "../Selectors/stateSelectors";
import { PHASE_1_PROFILE_TABS, PHASE_1_RCP_TABS } from "../Selectors/uilocationSelectors";
import { composeL } from "../Utilities/compose";
import { TabId } from "../Utilities/LocationUtils";
import { pipe } from "../Utilities/pipe";
import { convertHero } from "../Utilities/Raw/compatibilityUtils";
import { convertFromRawHero } from "../Utilities/Raw/initHeroUtils";
import { isBookEnabled, sourceBooksPairToTuple } from "../Utilities/RulesUtils";
import { UndoState } from "../Utilities/undo";
import { AppState, AppStateRecord } from "./appReducer";
import { appSlicesReducer } from "./appSlicesReducer";
import { HeroesStateL } from "./herolistReducer";
import { toHeroWithHistory } from "./heroReducer";
import { uiReducer } from "./uiReducer";

type Action = ReceiveInitialDataAction
            | ReceiveImportedHeroAction
            | RedoAction
            | UndoAction

const prepareHerolist =
  (action: ReceiveInitialDataAction): ident<AppStateRecord> => {
    const { heroes: rawHeroes } = action.payload

    interface Reduced {
      heroes: OrderedMap<string, Record<UndoState<HeroModelRecord>>>
      users: OrderedMap<string, User>
    }

    if (isJust (rawHeroes)) {
      const hs = Object.entries (fromJust (rawHeroes)).reduce<Reduced> (
        ({ heroes, users }, [key, hero]) => {
          const updatedHero = uncurry (convertHero) (action.payload.tables) (hero)
          const heroInstance = convertFromRawHero (fst (action.payload.tables))
                                                  (snd (action.payload.tables))
                                                  (updatedHero)

          const undoState = toHeroWithHistory (heroInstance)

          if (typeof updatedHero.player === "object") {
            return {
              users: insert (updatedHero.player.id) (updatedHero.player) (users),
              heroes: insert (key) (undoState) (heroes),
            }
          }
          else {
            return {
              users,
              heroes: insert (key) (undoState) (heroes),
            }
          }
        },
        {
          heroes: OrderedMap.empty,
          users: OrderedMap.empty,
        }
      )

      return over (appSlicesReducer.L.herolist)
                  (pipe (
                    set (HeroesStateL.heroes) (hs.heroes),
                    set (HeroesStateL.users) (hs.users)
                  ))
    }

    return ident
  }

const prepareImportedHero =
  (action: ReceiveImportedHeroAction) =>
  (state: AppStateRecord): AppStateRecord => {
    const { data, player } = action.payload

    const ml10n = getLocaleMessages (state)
    const wiki = getWiki (state)

    if (isNothing (ml10n)) {
      return over (composeL (AppState.L.ui, uiReducer.L.alerts))
                  (consF<Alert> ({
                    title: "No localization loaded!",
                    message: "Could not prepare imported hero for integration.",
                  }))
                  (state)
    }

    const l10n = fromJust (ml10n)

    const updatedHero = convertHero (l10n) (wiki) (data)
    const heroInstance = convertFromRawHero (l10n)
                                            (appSlicesReducer.A.wiki (state))
                                            (updatedHero)


    if (typeof player === "object") {
      const undoStateWithPlayer = toHeroWithHistory (set (HeroModelL.player)
                                                    (Just (player.id))
                                                    (heroInstance))

      return over (appSlicesReducer.L.herolist)
                  (pipe (
                    over (HeroesStateL.heroes) (insert (data.id) (undoStateWithPlayer)),
                    over (HeroesStateL.users) (insert (player.id) (player))
                  ))
                  (state)
    }

    const undoState = toHeroWithHistory (heroInstance)

    return over (composeL (appSlicesReducer.L.herolist, HeroesStateL.heroes))
                (insert (data.id) (undoState))
                (state)
  }

export const appPostReducer =
  (previousState: AppStateRecord) => (action: Action): ident<AppStateRecord> => {
    switch (action.type) {
      case ActionTypes.RECEIVE_INITIAL_DATA:
        return prepareHerolist (action)

      case ActionTypes.RECEIVE_IMPORTED_HERO:
        return prepareImportedHero (action)

      case ActionTypes.UNDO: {
        return join (state => {
          const current_tab = getCurrentTab (state)

          if (isNothing (getCurrentCultureId (state))
              && current_tab === TabId.Professions) {
            return set (composeL (appSlicesReducer.L.ui, uiReducer.L.location))
                       (TabId.Cultures)
          }
          else if (isNothing (getCurrentRaceId (state)) && current_tab === TabId.Cultures) {
            return set (composeL (appSlicesReducer.L.ui, uiReducer.L.location))
                       (TabId.Races)
          }
          else if (elem (1) (getPhase (state))
                   && notElem (current_tab) (PHASE_1_PROFILE_TABS)
                   && notElem (current_tab) (PHASE_1_RCP_TABS)) {
            return set (composeL (appSlicesReducer.L.ui, uiReducer.L.location))
                       (TabId.Professions)
          }

          const rule_books_enabled =
            getRuleBooksEnabledM (previousState, { mhero: getCurrentHeroPresent (previousState) })

          if (or (fmapF (rule_books_enabled)
                        (pipe (
                          sourceBooksPairToTuple,
                          flip (uncurry3 (isBookEnabled)) ("US25208")
                        )))
              && and (fmapF (rule_books_enabled)
                            (pipe (
                              sourceBooksPairToTuple,
                              notP (flip (uncurry3 (isBookEnabled)) ("US25208"))
                            )))
              && current_tab === TabId.ZoneArmor) {
            return set (composeL (appSlicesReducer.L.ui, uiReducer.L.location))
                       (TabId.Equipment)
          }

          return ident
        })
      }

      case ActionTypes.REDO: {
        return join (state => {
          const current_tab = getCurrentTab (state)

          if (elem (2) (getPhase (previousState))
              && elem (3) (getPhase (state))
              && List.elem (current_tab) (List (TabId.Advantages, TabId.Disadvantages))) {
            return set (composeL (appSlicesReducer.L.ui, uiReducer.L.location))
                       (TabId.Profile)
          }
          else if (elem (2) (getPhase (state))
                   && List.elem (current_tab) (PHASE_1_RCP_TABS)) {
            return set (composeL (appSlicesReducer.L.ui, uiReducer.L.location))
                       (TabId.Attributes)
          }

          return ident
        })
      }

      default:
        return ident
    }
  }
