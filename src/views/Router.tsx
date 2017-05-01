import { remote } from 'electron';
import * as React from 'react';
import { Loader } from '../components/Loader';
import { TitleBar } from '../components/titlebar/TitleBar';
import { TitleBarControls } from '../components/titlebar/TitleBarControls';
import { TitleBarDrag } from '../components/titlebar/TitleBarDrag';
import { LoaderStore } from '../stores/LoaderStore';
import { LocaleStore } from '../stores/LocaleStore';
import { TabStore } from '../stores/LocationStore';
import { Locale } from '../types/data.d';
import { Route } from './Route';

interface State {
	isLoading: boolean;
	loadingText: string;
	locale: Locale;
	section: string;
	tab: string;
}

export class Router extends React.Component<{}, State> {
	state = {
		section: TabStore.getCurrentSID(),
		tab: TabStore.getCurrentID(),
		isLoading: LoaderStore.isLoading(),
		loadingText: LoaderStore.getLoadingText(),
		locale: LocaleStore.getCurrent()
	};

	componentDidMount() {
		LoaderStore.addChangeListener(this.updateLoaderStore);
		LocaleStore.addChangeListener(this.updateLocaleStore);
		TabStore.addChangeListener(this.updateTabStore);
	}

	componentWillUnmount() {
		LoaderStore.removeChangeListener(this.updateLoaderStore);
		LocaleStore.removeChangeListener(this.updateLocaleStore);
		TabStore.removeChangeListener(this.updateTabStore);
	}

	render() {
		const { isLoading, loadingText, section, tab, locale } = this.state;
		const controlsElement = remote.process.platform !== 'darwin' && <TitleBarControls/>;

		return (
			<div id="body">
				<TitleBarDrag>
					{controlsElement}
				</TitleBarDrag>
				{isLoading && <Loader text={loadingText} />}
				<TitleBar currentSection={section} currentTab={tab} locale={locale} />
				<Route id={tab} />
			</div>
		);
	}

	private updateLoaderStore = () => {
		this.setState({
			isLoading: LoaderStore.isLoading(),
			loadingText: LoaderStore.getLoadingText()
		} as State);
	}

	private updateLocaleStore = () => {
		this.setState({
			locale: LocaleStore.getCurrent()
		} as State);
	}

	private updateTabStore = () => {
		this.setState({
			section: TabStore.getCurrentSID(),
			tab: TabStore.getCurrentID()
		} as State);
	}
}
