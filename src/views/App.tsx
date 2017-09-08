import * as React from 'react';
import { Scroll } from '../components/Scroll';
import { TitleBar } from '../components/TitleBar';
import { NavigationBarContainer } from '../containers/NavigationBar';
import { UIMessages } from '../types/ui.d';
import { Route } from './Route';

export interface AppOwnProps {}

export interface AppStateProps {
	currentTab: string;
	locale?: UIMessages;
	platform: string;
	theme: string;
}

export interface AppDispatchProps {
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
		const { locale, currentTab, theme, ...other } = this.props;
		const { hasError } = this.state;

		if (hasError) {
			return <div id="body" className={`theme-${theme}`}>
				<Scroll className="error-message">
					<h4>Error</h4>
					<p>{hasError.error.stack}</p>
					<h4>Component Stack</h4>
					<p>{hasError.info.componentStack}</p>
				</Scroll>
			</div>;
		}

		if (!locale) {
			return <div id="body" className={`theme-${theme}`}></div>;
		}

		return (
			<div id="body" className={`theme-${theme}`}>
				<div className="background-image"></div>
				<TitleBar {...other} />
				<NavigationBarContainer locale={locale} />
				<Route id={currentTab} locale={locale} />
			</div>
		);
	}
}
