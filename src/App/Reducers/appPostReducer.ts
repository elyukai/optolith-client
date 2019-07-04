import { notP } from "../../Data/Bool";
import { flip, ident, join } from "../../Data/Function";
import { fmapF } from "../../Data/Functor";
import { over, set } from "../../Data/Lens";
import { consF, List } from "../../Data/List";
import { and, elem, fromJust, isJust, isNothing, Just, or } from "../../Data/Maybe";
import { insert, OrderedMap } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { fst, snd } from "../../Data/Tuple";
import { RedoAction, UndoAction } from "../Actions/HistoryActions";
import { ReceiveImportedHeroAction, ReceiveInitialDataAction } from "../Actions/IOActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel";
import { Alert, User } from "../Models/Hero/heroTypeHelpers";
import { getRuleBooksEnabled } from "../Selectors/rulesSelectors";
import { getCurrentCultureId, getCurrentRaceId, getCurrentTab, getLocaleMessages, getPhase } from "../Selectors/stateSelectors";
import { composeL } from "../Utilities/compose";
import { TabId } from "../Utilities/LocationUtils";
import { pipe } from "../Utilities/pipe";
import { convertHero } from "../Utilities/Raw/compatibilityUtils";
import { convertFromRawHero } from "../Utilities/Raw/initHeroUtils";
import { isBookEnabled } from "../Utilities/RulesUtils";
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
          const updatedHero = convertHero (fst (action.payload.tables)) (hero)
          const heroInstance = convertFromRawHero (fst (action.payload.tables))
                                                  (snd (action.payload.tables))
                                                  (updatedHero)

          const undoState = toHeroWithHistory (heroInstance)

          if (updatedHero.player) {
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

    if (isNothing (ml10n)) {
      return over (composeL (AppState.L.ui, uiReducer.L.alerts))
                  (consF<Alert> ({
                    title: "No localization loaded!",
                    message: "Could not prepare imported hero for integration.",
                  }))
                  (state)
    }

    const l10n = fromJust (ml10n)

    const updatedHero = convertHero (l10n) (data)
    const heroInstance = convertFromRawHero (l10n)
                                            (appSlicesReducer.A.wiki (state))
                                            (updatedHero)


    if (player) {
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
          if (isNothing (getCurrentCultureId (state))
              && getCurrentTab (state) === TabId.Professions) {
            return set (composeL (appSlicesReducer.L.ui, uiReducer.L.location))
                       (TabId.Cultures)
          }

          if (isNothing (getCurrentRaceId (state)) && getCurrentTab (state) === TabId.Cultures) {
            return set (composeL (appSlicesReducer.L.ui, uiReducer.L.location))
                       (TabId.Races)
          }

          const rule_books_enabled = getRuleBooksEnabled (previousState)

          if (or (fmapF (rule_books_enabled) (flip (isBookEnabled) ("US25208")))
              && and (fmapF (rule_books_enabled) (notP (flip (isBookEnabled) ("US25208"))))
              && getCurrentTab (state) === TabId.ZoneArmor) {
            return set (composeL (appSlicesReducer.L.ui, uiReducer.L.location))
                       (TabId.Equipment)
          }

          return ident
        })
      }

      case ActionTypes.REDO: {
        return join (state => {
          if (elem (2) (getPhase (previousState))
              && elem (3) (getPhase (state))
              && List.elem (getCurrentTab (state)) (List (TabId.Advantages, TabId.Disadvantages))) {
            return set (composeL (appSlicesReducer.L.ui, uiReducer.L.location))
                       (TabId.Profile)
          }

          return ident
        })
      }

      default:
        return ident
    }
  }
