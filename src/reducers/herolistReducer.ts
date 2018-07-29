import { Action } from 'redux';
import * as HerolistActions from '../actions/HerolistActions';
import * as IOActions from '../actions/IOActions';
import { ActionTypes } from '../constants/ActionTypes';
import { HeroDependent, User } from '../types/data.d';
import { Maybe, OrderedMap, OrderedSet, Record } from '../utils/dataUtils';
import { getInitialHeroObject } from '../utils/initHeroUtils';
import { reduceReducers } from '../utils/reduceReducers';
import { UndoState, wrapWithHistoryObject } from '../utils/undo';
import { heroReducer } from './heroReducer';

type PrecedingHerolistReducerAction =
  IOActions.ReceiveInitialDataAction |
  IOActions.ReceiveImportedHeroAction |
  HerolistActions.CreateHeroAction |
  HerolistActions.LoadHeroAction |
  HerolistActions.SaveHeroAction |
  HerolistActions.DeleteHeroAction |
  HerolistActions.DuplicateHeroAction;

export interface HerolistState {
  heroes: OrderedMap<string, UndoState<Record<HeroDependent>>>;
  users: OrderedMap<string, User>;
  currentId?: string;
}

const initialState: HerolistState = {
  heroes: OrderedMap.empty(),
  users: OrderedMap.empty()
};

export function precedingHerolistReducer(
  state: HerolistState = initialState,
  action: PrecedingHerolistReducerAction,
): HerolistState {
  switch (action.type) {
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
        OrderedSet.of(enabledRuleBooks),
      );

      return {
        ...state,
        currentId: id,
        heroes: state.heroes.insert(id, wrapWithHistoryObject(hero)),
      };
    }

    case ActionTypes.LOAD_HERO:
      return {
        ...state,
        currentId: action.payload.data.id,
      };

    case ActionTypes.SAVE_HERO: {
      const { id } = action.payload.data;

      return {
        ...state,
        heroes: state.heroes.adjust(
          undoState => ({
            ...undoState,
            past: []
          }),
          id
        )
      };
    }

    case ActionTypes.DELETE_HERO: {
      const { id } = action.payload;

      const hero = state.heroes.lookup(id);
      const heroes = state.heroes.delete(id);

      const playerId = hero.bind<string>(
        justHero => justHero.present.lookup('player')
      );

      const hasUserMultipleHeroes = heroes.elems().any(
        e => e.present.lookup('player').equals(playerId)
      );

      if (Maybe.isJust(playerId) && !hasUserMultipleHeroes) {
        return {
          ...state,
          users: state.users.delete(Maybe.fromJust(playerId)),
          heroes
        };
      }
      else {
        return {
          ...state,
          heroes,
        };
      }
    }

    case ActionTypes.DUPLICATE_HERO: {
      const { id, newId } = action.payload;

      return Maybe.fromMaybe(
        state,
        state.heroes.lookup(id)
          .map(
            hero => ({
              ...state,
              heroes: state.heroes.insert(
                newId,
                wrapWithHistoryObject(
                  hero.present
                    .insert('id', newId)
                    .modify(name => `${name} (2)`, 'name')
                )
              )
            })
          )
      );
    }

    default:
      return state;
  }
}

function prepareHeroReducer(state: HerolistState, action: Action): HerolistState {
  return Maybe.fromMaybe(
    state,
    Maybe.of(state.currentId)
      .map(currentId =>
        ({
          ...state,
          heroes: state.heroes.adjust(
            heroState => heroReducer(heroState, action),
            currentId
          )
        })
      )
  );
}

export const herolistReducer = reduceReducers(
  precedingHerolistReducer,
  prepareHeroReducer
);
