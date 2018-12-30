import { Action, combineReducers } from 'redux';
import { Record } from '../utils/dataUtils';
import { reduceReducers } from '../utils/reduceReducers';
import { WikiAll } from '../utils/wikiData/wikiTypeHelpers';
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
