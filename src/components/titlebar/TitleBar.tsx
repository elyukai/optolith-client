import * as React from 'react';
import { CurrentHeroInstanceState } from '../../reducers/currentHero';
import { UIMessages } from '../../types/ui.d';
import { TitleBarForGroup } from './TitleBarForGroup';
import { TitleBarForHero } from './TitleBarForHero';
import { TitleBarForMain } from './TitleBarForMain';

export interface NavigationBarProps {
	currentSection: string;
	currentTab: string;
	locale: UIMessages;
	localeString?: string;
	localeType: 'default' | 'set';
	hero: CurrentHeroInstanceState;
	isRedoAvailable: boolean;
	isUndoAvailable: boolean;
	undo(): void;
	redo(): void;
	saveConfig(): void;
	saveHero(): void;
	saveHeroes(): void;
	saveGroup(): void;
	setLocale(id?: string): void;
	setSection(id: string): void;
	setTab(id: string): void;
	setTheme(id: string): void;
}

export function NavigationBar(props: NavigationBarProps) {
	const { currentSection, currentTab, locale, localeString, localeType, hero, isRedoAvailable, isUndoAvailable, ...other } = props;

	if (currentSection === 'main') {
		return (
			<TitleBarForMain
				currentTab={currentTab}
				locale={locale}
				localeString={localeString}
				localeType={localeType}
				{...other}
				/>
		);
	}
	else if (currentSection === 'hero') {
		return (
			<TitleBarForHero
				hero={hero}
				currentTab={currentTab}
				isUndoAvailable={isUndoAvailable}
				isRedoAvailable={isRedoAvailable}
				locale={locale}
				localeString={localeString}
				localeType={localeType}
				{...other}
				/>
		);
	}
	else if (currentSection === 'group') {
		return (
			<TitleBarForGroup
				groupName=""
				locale={locale}
				localeString={localeString}
				localeType={localeType}
				{...other}
				/>
		);
	}
	return null;
}
