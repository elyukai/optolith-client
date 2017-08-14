import * as React from 'react';
import { Scroll } from '../components/Scroll';
import { TitleBar as TitleBarNew } from '../components/TitleBar';
import { TitleBar } from '../components/titlebar/TitleBar';
import { CurrentHeroInstanceState } from '../reducers/currentHero';
import { UIMessages } from '../types/ui.d';
import { Route } from './Route';

export interface AppOwnProps {}

export interface AppStateProps {
	hero: CurrentHeroInstanceState;
	isRedoAvailable: boolean;
	isUndoAvailable: boolean;
	locale?: UIMessages;
	localeString?: string;
	localeType: 'default' | 'set';
	platform: string;
	section: string;
	tab: string;
}

export interface AppDispatchProps {
	setSection(id: string): void;
	setTab(id: string): void;
	undo(): void;
	redo(): void;
	saveConfig(): void;
	saveHero(): void;
	saveHeroes(): void;
	saveGroup(): void;
	setLocale(id?: string): void;
	minimize(): void;
	maximize(): void;
	restore(): void;
	close(): void;
}

export type AppProps = AppStateProps & AppDispatchProps & AppOwnProps;

export interface AppState {
	hasError?: {
		error: Error;
		info: any;
	};
}

export class App extends React.Component<AppProps, AppState> {
	state: AppState = {};

	componentDidCatch(error: any, info: any) {
		this.setState(() => ({ hasError: { error, info }}));
	}

	render() {
		const { locale, section, tab, ...other } = this.props;
		const { hasError } = this.state;

		if (hasError) {
			return <div id="body">
				<Scroll className="error-message">
					<h4>Error</h4>
					<p>{hasError.error.stack}</p>
					<h4>Component Stack</h4>
					<p>{hasError.info.componentStack}</p>
				</Scroll>
			</div>;
		}

		if (!locale) {
			return <div id="body"></div>;
		}

		return (
			<div id="body">
				<TitleBarNew {...other}/>
				<TitleBar currentSection={section} currentTab={tab} locale={locale} {...other} />
				<Route id={tab} locale={locale} />
			</div>
		);
	}
}
