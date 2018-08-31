import { Action } from 'redux';
import * as HerolistActions from '../actions/HerolistActions';
import * as IOActions from '../actions/IOActions';
import { ActionTypes } from '../constants/ActionTypes';
import { HeroDependent, User } from '../types/data';
import { List, Maybe, OrderedMap, OrderedSet, Record } from '../utils/dataUtils';
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

interface HerolistStateObject {
  heroes: OrderedMap<string, UndoState<Record<HeroDependent>>>;
  users: OrderedMap<string, User>;
  currentId?: string;
}

export type HerolistState = Record<HerolistStateObject>;

const initialState: HerolistState = Record.of<HerolistStateObject> ({
  heroes: OrderedMap.empty (),
  users: OrderedMap.empty ()
});

export function precedingHerolistReducer (
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

      const hero = getInitialHeroObject (
        id,
        name,
        sex,
        el,
        totalAp,
        enableAllRuleBooks,
        OrderedSet.of (enabledRuleBooks),
      );

      return state
        .insert ('currentId') (id)
        .modify<'heroes'> (heroes => heroes.insert (id) (wrapWithHistoryObject (hero)))
                          ('heroes');
    }

    case ActionTypes.LOAD_HERO:
      return state.insert ('currentId') (action.payload.id);

    case ActionTypes.SAVE_HERO: {
      const { id } = action.payload.data;

      return state.modify<'heroes'> (
        heroes => heroes.adjust (
          undoState => ({
            ...undoState,
            past: List.of ()
          })
        ) (id)
      ) ('heroes');
    }

    case ActionTypes.DELETE_HERO: {
      const { id } = action.payload;

      const hero = state.get ('heroes').lookup (id);
      const heroes = state.get ('heroes').delete (id);

      const playerId = hero.bind<string> (
        justHero => justHero.present.lookup ('player')
      );

      const hasUserMultipleHeroes = heroes.elems ().any (
        e => e.present.lookup ('player').equals (playerId)
      );

      if (Maybe.isJust (playerId) && !hasUserMultipleHeroes) {
        return state
          .modify<'users'> (users => users.delete (Maybe.fromJust (playerId))) ('users')
          .insert ('heroes') (heroes);
      }
      else {
        return state.insert ('heroes') (heroes);
      }
    }

    case ActionTypes.DUPLICATE_HERO: {
      const { id, newId } = action.payload;

      return Maybe.fromMaybe (state) (
        state.get ('heroes').lookup (id)
          .fmap (
            hero => state.modify<'heroes'> (
              heroes => heroes.insert (newId) (
                wrapWithHistoryObject (
                  hero.present
                    .insert ('id') (newId)
                    .modify (name => `${name} (2)`) ('name')
                )
              )
            ) ('heroes')
          )
      );
    }

    default:
      return state;
  }
}

function prepareHeroReducer (state: HerolistState, action: Action): HerolistState {
  return Maybe.fromMaybe (state) (
    state.lookup ('currentId')
      .fmap (
        currentId => state.modify<'heroes'> (
          heroes => heroes.adjust (heroState => heroReducer (heroState, action)) (currentId)
        ) ('heroes')
      )
  );
}

export const herolistReducer = reduceReducers (
  precedingHerolistReducer,
  prepareHeroReducer
);
