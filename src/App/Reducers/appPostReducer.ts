import { ident } from "../../Data/Function";
import { over } from "../../Data/Lens";
import { isJust } from "../../Data/Maybe";
import { OrderedMap } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { RedoAction, UndoAction } from "../Actions/HistoryActions";
import { ReceiveImportedHeroAction, ReceiveInitialDataAction } from "../Actions/IOActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { HeroModelRecord } from "../Models/Hero/HeroModel";
import { User } from "../Models/Hero/heroTypeHelpers";
import { getRuleBooksEnabled } from "../Selectors/rulesSelectors";
import { getCurrentCultureId, getCurrentRaceId, getCurrentTab, getPhase } from "../Selectors/stateSelectors";
import { convertHero } from "../Utilities/Raw/compatibilityUtils";
import { isBookEnabled } from "../Utilities/RulesUtils";
import { UndoState } from "../Utilities/undo";
import { AppState, AppStateRecord } from "./appReducer";

type Action = ReceiveInitialDataAction
            | ReceiveImportedHeroAction
            | RedoAction
            | UndoAction

const prepareHerolist =
  (action: ReceiveInitialDataAction): ident<AppStateRecord> => {
    const { heroes: rawHeroes } = action.payload

    interface Reduced {
      heroes: OrderedMap<string, UndoState<HeroModelRecord>>
      users: OrderedMap<string, User>
    }

    if (isJust (rawHeroes)) {
      return over (AppState.L.herolist)
                  ()
      return {
        ...state,
        herolist: state.herolist
          .merge (Record.of (
            Object.entries (rawHeroes).reduce<Reduced> (
              ({ heroes, users }, [key, hero]) => {
                const updatedHero = convertHero (hero)
                const heroInstance = getHeroInstance (state.wiki, key, updatedHero)

                if (hero.name === "ReworkTest#1") {
                  console.log (hero, updatedHero, heroInstance)
                }

                const undoState = wrapWithHistoryObject (heroInstance)

                if (updatedHero.player) {
                  return {
                    users: users.insert (updatedHero.player.id) (updatedHero.player),
                    heroes: heroes.insert (key) (undoState),
                  }
                }
                else {
                  return {
                    users,
                    heroes: heroes.insert (key) (undoState),
                  }
                }
              },
              {
                heroes: OrderedMap.empty (),
                users: OrderedMap.empty (),
              }
            )
          )),
      }
    }

    return state
  }

const prepareImportedHero = (state: AppState, action: ReceiveImportedHeroAction) => {
  const { data, player } = action.payload

  const updatedHero = convertHero (data)
  const heroInstance = getHeroInstance (state.wiki, data.id, updatedHero)


  if (player) {
    const undoState = wrapWithHistoryObject (
      heroInstance.insert ("player") (player.id)
    )

    return {
      ...state,
      herolist: state.herolist
        .modify<"users"> (OrderedMap.insert<string, User> (player.id) (player))
                         ("users")
        .modify<"heroes"> (OrderedMap.insert<string, UndoState<Hero>> (data.id) (undoState))
                          ("heroes"),
    }
  }
  else {
    const undoState = wrapWithHistoryObject (heroInstance)

    return {
      ...state,
      herolist: state.herolist
        .modify<"heroes"> (OrderedMap.insert<string, UndoState<Hero>> (data.id) (undoState))
                          ("heroes"),
    }
  }
}

export function appPostReducer (
  state: AppState,
  action: Action,
  previousState: AppState | undefined
): AppState {
  switch (action.type) {
    case ActionTypes.RECEIVE_INITIAL_DATA:
      return prepareHerolist (state, action)

    case ActionTypes.RECEIVE_IMPORTED_HERO:
      return prepareImportedHero (state, action)

    case ActionTypes.UNDO: {
      if (getCurrentCultureId (state) === undefined && getCurrentTab (state) === "professions") {
        return {
          ...state,
          ui: {
            ...state.ui,
            location: {
              ...state.ui.location,
              tab: "cultures",
            },
          },
        }
      }

      if (getCurrentRaceId (state) === undefined && getCurrentTab (state) === "cultures") {
        return {
          ...state,
          ui: {
            ...state.ui,
            location: {
              ...state.ui.location,
              tab: "races",
            },
          },
        }
      }

      if (
        previousState
        && isBookEnabled (action.payload.books) (
            Maybe.fromMaybe<true | OrderedSet<string>> (OrderedSet.empty ())
                                                       (getRuleBooksEnabled (previousState))
          ) ("US25208")
        && !isBookEnabled (action.payload.books) (
            Maybe.fromMaybe<true | OrderedSet<string>> (OrderedSet.empty ())
                                                       (getRuleBooksEnabled (previousState))
          ) ("US25208")
        && getCurrentTab (state) === "zoneArmor"
      ) {
        return {
          ...state,
          ui: {
            ...state.ui,
            location: {
              ...state.ui.location,
              tab: "equipment",
            },
          },
        }
      }

      return state
    }

    case ActionTypes.REDO: {
      if (
        previousState
        && Maybe.elem (2) (getPhase (previousState))
        && Maybe.elem (3) (getPhase (state))
        && ["advantages", "disadvantages"].includes (getCurrentTab (state))
      ) {
        return {
          ...state,
          ui: {
            ...state.ui,
            location: {
              ...state.ui.location,
              tab: "profile",
            },
          },
        }
      }

      return state
    }

    default:
      return state
  }
}
