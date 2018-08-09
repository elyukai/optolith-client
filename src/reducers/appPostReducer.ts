import { RedoAction, UndoAction } from '../actions/HistoryActions';
import { ReceiveImportedHeroAction, ReceiveInitialDataAction } from '../actions/IOActions';
import { ActionTypes } from '../constants/ActionTypes';
import { areAllRuleBooksEnabled, getCurrentCultureId, getCurrentRaceId, getCurrentTab, getEnabledRuleBooks, getPhase } from '../selectors/stateSelectors';
import { HeroDependent, User } from '../types/data';
import { OrderedMap, Record } from '../utils/dataUtils';
import { getHeroInstance } from '../utils/initHeroUtils';
import { UndoState, wrapWithHistoryObject } from '../utils/undo';
import { convertHero } from '../utils/VersionUtils';
import { AppState } from './appReducer';

type Action =
  ReceiveInitialDataAction |
  ReceiveImportedHeroAction |
  RedoAction |
  UndoAction;

const prepareHerolist = (state: AppState, action: ReceiveInitialDataAction) => {
  const { heroes: rawHeroes } = action.payload;

  interface Reduced {
    heroes: OrderedMap<string, UndoState<Record<HeroDependent>>>;
    users: OrderedMap<string, User>;
  }

  if (rawHeroes) {
    return {
      ...state,
      herolist: state.herolist
        .merge(Record.of(
          Object.entries(rawHeroes).reduce<Reduced>(
            ({ heroes, users }, [key, hero]) => {
              const updatedHero = convertHero(hero);
              const heroInstance = getHeroInstance(state.wiki, key, updatedHero);

              const undoState = wrapWithHistoryObject(heroInstance);

              if (updatedHero.player) {
                return {
                  users: users.insert(updatedHero.player.id, updatedHero.player),
                  heroes: heroes.insert(key, undoState),
                };
              }
              else {
                return {
                  users,
                  heroes: heroes.insert(key, undoState),
                };
              }
            },
            {
              heroes: OrderedMap.empty(),
              users: OrderedMap.empty()
            }
          )
        ))
    };
  }

  return state;
};

const prepareImportedHero = (state: AppState, action: ReceiveImportedHeroAction) => {
  const { data, player } = action.payload;

  const updatedHero = convertHero(data);
  const heroInstance = getHeroInstance(state.wiki, data.id, updatedHero);


  if (player) {
    const undoState = wrapWithHistoryObject(
      heroInstance.insert('player', player.id)
    );

    return {
      ...state,
      herolist: state.herolist
        .modify(
          users => users.insert(player.id, player),
          'users'
        )
        .modify(
          heroes => heroes.insert(data.id, undoState),
          'heroes'
        )
    };
  }
  else {
    const undoState = wrapWithHistoryObject(heroInstance);

    return {
      ...state,
      herolist: state.herolist
        .modify(
          heroes => heroes.insert(data.id, undoState),
          'heroes'
        )
    };
  }
};

export function appPostReducer(
  state: AppState,
  action: Action,
  previousState: AppState | undefined,
): AppState {
  switch (action.type) {
    case ActionTypes.RECEIVE_INITIAL_DATA:
      return prepareHerolist(state, action);

    case ActionTypes.RECEIVE_IMPORTED_HERO:
      return prepareImportedHero(state, action);

    case ActionTypes.UNDO: {
      if (getCurrentCultureId(state) === undefined && getCurrentTab(state) === 'professions') {
        return {
          ...state,
          ui: {
            ...state.ui,
            location: {
              ...state.ui.location,
              tab: 'cultures',
            },
          },
        };
      }
      else if (getCurrentRaceId(state) === undefined && getCurrentTab(state) === 'cultures') {
        return {
          ...state,
          ui: {
            ...state.ui,
            location: {
              ...state.ui.location,
              tab: 'races',
            },
          },
        };
      }
      else if (
        previousState
        && (
          (
            areAllRuleBooksEnabled(previousState)
            && !areAllRuleBooksEnabled(state)
            && !getEnabledRuleBooks(state).has('US25208')
          )
          || (
            getEnabledRuleBooks(previousState).has('US25208')
            && !getEnabledRuleBooks(state).has('US25208')
          )
        )
        && getCurrentTab(state) === 'zoneArmor'
      ) {
        return {
          ...state,
          ui: {
            ...state.ui,
            location: {
              ...state.ui.location,
              tab: 'equipment',
            },
          },
        };
      }

      return state;
    }

    case ActionTypes.REDO: {
      if (
        previousState
        && getPhase(previousState) === 2
        && getPhase(state) === 3
        && ['advantages', 'disadvantages'].includes(getCurrentTab(state))
      ) {
        return {
          ...state,
          ui: {
            ...state.ui,
            location: {
              ...state.ui.location,
              tab: 'profile',
            },
          },
        };
      }

      return state;
    }

    default:
      return state;
  }
}
