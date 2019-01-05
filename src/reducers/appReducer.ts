import { Action, combineReducers } from 'redux';
import { WikiAll } from '../App/Models/Wiki/wikiTypeHelpers';
import { reduceReducers } from '../App/Utils/reduceReducers';
import { Record } from '../utils/dataUtils';
import { appPostReducer } from './appPostReducer';
import { herolistReducer as herolist, HerolistState } from './herolistReducer';
import { localeReducer as locale, LocaleState } from './localeReducer';
import { uiReducer as ui, UIState } from './uiReducer';
import { wikiReducer as wiki } from './wikiReducer';

export interface AppState {
  herolist: HerolistState;
  locale: LocaleState;
  ui: UIState;
  wiki: Record<WikiAll>;
}

const appSlices = combineReducers<AppState> ({
  herolist,
  locale,
  ui,
  wiki,
});

export const appReducer = reduceReducers<AppState, Action> (appSlices, appPostReducer);
