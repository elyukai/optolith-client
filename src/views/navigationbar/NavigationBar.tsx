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
	isRemovingEnabled: boolean;
	isUndoAvailable: boolean;
	isSettingsOpen: boolean;
}

export interface NavigationBarDispatchProps {
	undo(): void;
	redo(): void;
	saveHero(): void;
	saveHeroes(): void;
	saveGroup(): void;
	setSection(id: string): void;
	setTab(id: string): void;
	openSettings(): void;
	closeSettings(): void;
}

export type NavigationBarProps = NavigationBarStateProps & NavigationBarDispatchProps & NavigationBarOwnProps;

export class NavigationBar extends React.Component<NavigationBarProps> {
	render() {
		const { currentSection } = this.props;

		switch (currentSection) {
			case 'main':
				return <NavigationBarForMain
					{...this.props}
					{...this.state}
					/>;

			case 'hero':
				return <NavigationBarForHero
					{...this.props}
					{...this.state}
					/>;

			case 'group':
				return <NavigationBarForGroup
					{...this.props}
					{...this.state}
					groupName=""
					/>;

			default:
				return <div></div>;
		}
	}
}
