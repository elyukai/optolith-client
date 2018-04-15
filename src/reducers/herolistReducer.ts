import * as HerolistActions from '../actions/HerolistActions';
import * as IOActions from '../actions/IOActions';
import { ActionTypes } from '../constants/ActionTypes';
import { HeroDependent, User } from '../types/data.d';
import { removeListItem, setListItem } from '../utils/ListUtils';
import { convertHero } from '../utils/VersionUtils';
import { getHeroInstance, getInitialHeroObject } from '../utils/InitUtils';
import { UndoState, wrapWithHistoryObject } from '../utils/undo';
import { reduceReducers } from '../utils/reduceReducers';
import { heroReducer } from './heroReducer';
import { Action } from 'redux';

type PrecedingHerolistReducerAction =
  IOActions.ReceiveInitialDataAction |
  IOActions.ReceiveImportedHeroAction |
  HerolistActions.CreateHeroAction |
  HerolistActions.LoadHeroAction |
  HerolistActions.SaveHeroAction |
  HerolistActions.DeleteHeroAction |
  HerolistActions.DuplicateHeroAction;

export interface HerolistState {
  heroes: Map<string, UndoState<HeroDependent>>;
  users: Map<string, User>;
  currentId?: string;
}

const initialState: HerolistState = {
  heroes: new Map(),
  users: new Map()
};

export function precedingHerolistReducer(
  state: HerolistState = initialState,
  action: PrecedingHerolistReducerAction,
): HerolistState {
  switch (action.type) {
    case ActionTypes.RECEIVE_INITIAL_DATA: {
      const { heroes: rawHeroes } = action.payload;

      const heroes = new Map<string, UndoState<HeroDependent>>();
      const users = new Map<string, User>();

      if (rawHeroes) {
        for (const [key, hero] of Object.entries(rawHeroes)) {
          const updatedHero = convertHero(hero);

          if (updatedHero.player) {
            users.set(updatedHero.player.id, updatedHero.player);
          }

          heroes.set(key, {
            past: [],
            present: getHeroInstance(key, updatedHero),
            future: [],
          });
        }
      }

      return {
        ...state,
        heroes,
        users
      };
    }

    case ActionTypes.CREATE_HERO: {
      const {
        el,
        enableAllRuleBooks,
        enabledRuleBooks,
        id,
        name,
        sex,
        totalAp,
      } = action.payload;

      const hero = getInitialHeroObject(
        id,
        name,
        sex,
        el,
        totalAp,
        enableAllRuleBooks,
        enabledRuleBooks,
      );

      return {
        ...state,
        currentId: id,
        heroes: setListItem(
          state.heroes,
          id,
          wrapWithHistoryObject(hero),
        ),
      };
    }

    case ActionTypes.LOAD_HERO:
      return {
        ...state,
        currentId: action.payload.data.id,
      };

    case ActionTypes.SAVE_HERO: {
      const { id } = action.payload.data;
      const hero = state.heroes.get(id);

      if (hero) {
        return {
          ...state,
          heroes: setListItem(
            state.heroes,
            id,
            {
              ...hero,
              past: [],
            },
          )
        };
      }

      console.warn('SAVE_HERO id not found');

      return state;
    }

    case ActionTypes.DELETE_HERO: {
      const { id } = action.payload;

      const hero = state.heroes.get(id);
      const heroes = removeListItem(state.heroes, id);

      let users = state.users;

      const playerId = hero && hero.present.player;
      const hasUserMultipleHeroes = [...heroes.values()].some(e => {
        return e.present.player === playerId;
      });

      if (playerId && !hasUserMultipleHeroes) {
        users = removeListItem(users, playerId);
      }

      return {
        ...state,
        heroes,
        users,
      };
    }

    case ActionTypes.RECEIVE_IMPORTED_HERO: {
      const { data, player } = action.payload;
      let users = state.users;

      const hero = getHeroInstance(data.id, data);

      if (player) {
        hero.player = player.id;
        users = setListItem(users, player.id, player);
      }

      const heroes = setListItem(
        state.heroes,
        hero.id,
        {
          past: [],
          present: hero,
          future: []
        }
      );

      return {
        ...state,
        heroes,
        users
      };
    }

    case ActionTypes.DUPLICATE_HERO: {
      const { id, newId } = action.payload;
      const hero = state.heroes.get(id);

      if (hero) {
        const heroes = setListItem(
          state.heroes,
          newId,
          {
            ...hero,
            present: {
              ...hero.present,
              id: newId,
            },
          }
        );

        return { ...state, heroes };
      }

      return state;
    }

    default:
      return state;
  }
}

function prepareHeroReducer(state: HerolistState, action: Action): HerolistState {
  const heroState = state.currentId && state.heroes.get(state.currentId);
  if (heroState) {
    const nextState = heroReducer(heroState, action);

    if (nextState !== heroState) {
      return {
        ...state,
        heroes: setListItem(
          state.heroes,
          state.currentId!,
          nextState
        ),
      };
    }
  }

  return state;
}

export const herolistReducer = reduceReducers(
  precedingHerolistReducer,
  prepareHeroReducer
);
