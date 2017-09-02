import { combineReducers } from 'redux';
import { reduceReducers } from '../utils/reduceReducers';
import { appPost } from './appPost';
import { currentHero, CurrentHeroState } from './currentHero';
import { herolist, HerolistState } from './herolist';
import { locale, LocaleState } from './locale';
import { ui, UIState } from './ui';

export interface AppState {
	currentHero: CurrentHeroState;
	herolist: HerolistState;
	locale: LocaleState;
	ui: UIState;
}

const appSlices = combineReducers<AppState>({
	currentHero,
	herolist,
	locale,
	ui
});

export const app = reduceReducers(appSlices, appPost);
