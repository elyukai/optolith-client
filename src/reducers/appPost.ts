import { RedoAction, UndoAction } from '../actions/HistoryActions';
import { ReceiveInitialDataAction } from '../actions/IOActions';
import { ActionTypes } from '../constants/ActionTypes';
import { getCurrentCultureId, getCurrentRaceId, getLocaleId, getEnabledRuleBooks, areAllRuleBooksEnabled } from '../selectors/stateSelectors';
import { getCurrentTab, getPhase } from '../selectors/stateSelectors';
import { Book, ExperienceLevel, ItemInstance } from '../types/data.d';
import { init } from '../utils/init';
import { initExperienceLevel, initItem } from '../utils/InitUtils';
import { AppState } from './app';

type Action = ReceiveInitialDataAction | RedoAction | UndoAction;

export function appPost(
  state: AppState,
  action: Action,
  previousState: AppState,
): AppState {
  switch (action.type) {
    case ActionTypes.RECEIVE_INITIAL_DATA: {
      const localeId = getLocaleId(state)!;
      return {
        ...state,
        currentHero: {
          ...state.currentHero,
          present: {
            ...state.currentHero.present,
            dependent: init(action.payload.tables, action.payload.locales[localeId]),
            el: {
              ...state.currentHero.present.el,
              all: new Map(Object.entries(action.payload.tables.el).map(([key, obj]) => {
                return [key, initExperienceLevel(obj, action.payload.locales[localeId].el)] as [string, ExperienceLevel];
              }))
            },
            equipment: {
              ...state.currentHero.present.equipment,
              itemTemplates: new Map(Object.entries(action.payload.tables.items).map(([key, obj]) => {
                return [key, initItem(obj, action.payload.locales[localeId].items)] as [string, ItemInstance];
              }).filter(e => e[1]))
            }
          }
        },
        locale: {
          ...state.locale,
          books: Object.entries(action.payload.locales[localeId].books).reduce((map, [id, obj]) => map.set(id, obj), new Map<string, Book>())
        }
      };
    }

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
      else if ((areAllRuleBooksEnabled(previousState) && !areAllRuleBooksEnabled(state) && !getEnabledRuleBooks(state).has('US25208') || getEnabledRuleBooks(previousState).has('US25208') && !getEnabledRuleBooks(state).has('US25208')) && getCurrentTab(state) === 'zoneArmor') {
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
      if (getPhase(previousState) === 2 && getPhase(state) === 3 && ['advantages', 'disadvantages'].includes(getCurrentTab(state))) {
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
