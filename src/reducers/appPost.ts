import { ReceiveInitialDataAction } from '../actions/FileActions';
import { RedoAction, UndoAction } from '../actions/HistoryActions';
import * as ActionTypes from '../constants/ActionTypes';
import { getLocale } from '../selectors/I18n';
import { getCurrentTab, getPhase } from '../selectors/stateSelectors';
import { ExperienceLevel, ItemInstance } from '../types/data.d';
import { init } from '../utils/init';
import { initExperienceLevel, initItem } from '../utils/InitUtils';
import { AppState } from './app';

type Action = ReceiveInitialDataAction | RedoAction | UndoAction;

export function appPost(state: AppState, action: Action, previousState: AppState): AppState {
	switch (action.type) {
		case ActionTypes.RECEIVE_INITIAL_DATA: {
			return {
				...state,
				currentHero: {
					...state.currentHero,
					present: {
						...state.currentHero.present,
						dependent: init(action.payload.tables, action.payload.locales[getLocale(state)]),
						el: {
							...state.currentHero.present.el,
							all: new Map(Object.entries(action.payload.tables.el).map(([key, obj]) => {
								return [key, initExperienceLevel(obj, action.payload.locales[getLocale(state)].el)] as [string, ExperienceLevel];
							}))
						},
						equipment: {
							...state.currentHero.present.equipment,
							itemTemplates: new Map(Object.entries(action.payload.tables.items).map(([key, obj]) => {
								return [key, initItem(obj, action.payload.locales[getLocale(state)].items)] as [string, ItemInstance];
							}).filter(e => e))
						}
					}
				}
			};
		}

		case ActionTypes.UNDO: {
			if (getPhase(previousState) === 3 && getPhase(state) === 2 && getCurrentTab(state) === 'belongings') {
				return {
					ui: {
						location: {
							tab: 'profile',
							...state.ui.location
						},
						...state.ui
					},
					...state
				};
			}
			return state;
		}

		case ActionTypes.REDO: {
			if (getPhase(previousState) === 2 && getPhase(state) === 3 && getCurrentTab(state) === 'disadv') {
				return {
					ui: {
						location: {
							tab: 'profile',
							...state.ui.location
						},
						...state.ui
					},
					...state
				};
			}
			return state;
		}

		default:
			return state;
	}
}
