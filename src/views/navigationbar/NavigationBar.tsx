import * as React from 'react';
import { CurrentHeroInstanceState } from '../../reducers/currentHero';
import { UIMessages } from '../../types/ui.d';
import { NavigationBarForGroup } from './NavigationBarForGroup';
import { NavigationBarForHero } from './NavigationBarForHero';
import { NavigationBarForMain } from './NavigationBarForMain';

export interface NavigationBarOwnProps {
	locale: UIMessages;
}

export interface NavigationBarStateProps {
	currentSection: string;
	currentTab: string;
	hero: CurrentHeroInstanceState;
	isRedoAvailable: boolean;
	isUndoAvailable: boolean;
	localeString?: string;
	localeType: 'default' | 'set';
	theme: string;
}

export interface NavigationBarDispatchProps {
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

export type NavigationBarProps = NavigationBarStateProps & NavigationBarDispatchProps & NavigationBarOwnProps;

export interface NavigationBarState {
	showSettings?: boolean;
}

export class NavigationBar extends React.Component<NavigationBarProps, NavigationBarState> {
	state = {};

	openSettings = () => this.setState(() => ({ showSettings: true }));
	closeSettings = () => this.setState(() => ({ showSettings: false }));

	render() {
		const { currentSection } = this.props;

		switch (currentSection) {
			case 'main':
				return <NavigationBarForMain
					{...this.props}
					{...this.state}
					openSettings={this.openSettings}
					closeSettings={this.closeSettings}
					/>;

			case 'hero':
				return <NavigationBarForHero
					{...this.props}
					{...this.state}
					openSettings={this.openSettings}
					closeSettings={this.closeSettings}
					/>;

			case 'group':
				return <NavigationBarForGroup
					{...this.props}
					{...this.state}
					openSettings={this.openSettings}
					closeSettings={this.closeSettings}
					groupName=""
					/>;

			default:
				return <div></div>;
		}
	}
}
