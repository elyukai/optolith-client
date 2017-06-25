import { combineReducers } from 'redux';
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

export const app = combineReducers<AppState>({
	currentHero,
	herolist,
	locale,
	ui
});
