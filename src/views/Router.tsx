import { remote } from 'electron';
import * as React from 'react';
import { Loader } from '../components/Loader';
import { TitleBar } from '../components/titlebar/TitleBar';
import { TitleBarControls } from '../components/titlebar/TitleBarControls';
import { TitleBarDrag } from '../components/titlebar/TitleBarDrag';
import { LoaderStore } from '../stores/LoaderStore';
import { TabStore } from '../stores/LocationStore';
import { Route } from './Route';

interface State {
	isLoading: boolean;
	loadingText: string;
	section: string;
	tab: string;
}

export class Router extends React.Component<undefined, State> {
	state = {
		section: TabStore.getCurrentSID(),
		tab: TabStore.getCurrentID(),
		isLoading: LoaderStore.isLoading(),
		loadingText: LoaderStore.getLoadingText()
	};

	_updateLoaderStore = () => this.setState({
		isLoading: LoaderStore.isLoading(),
		loadingText: LoaderStore.getLoadingText()
	} as State)
	_updateTabStore = () => this.setState({
		section: TabStore.getCurrentSID(),
		tab: TabStore.getCurrentID()
	} as State)

	componentDidMount() {
		LoaderStore.addChangeListener(this._updateLoaderStore);
		TabStore.addChangeListener(this._updateTabStore);
	}

	componentWillUnmount() {
		LoaderStore.removeChangeListener(this._updateLoaderStore);
		TabStore.removeChangeListener(this._updateTabStore);
	}

	render() {
		const { isLoading, loadingText, section, tab } = this.state;
		const controlsElement = remote.process.platform !== 'darwin' && <TitleBarControls/>;

		return (
			<div id="body">
				<TitleBarDrag>
					{controlsElement}
				</TitleBarDrag>
				{isLoading && <Loader text={loadingText} />}
				<TitleBar currentSection={section} currentTab={tab} />
				<Route id={tab} />
			</div>
		);
	}
}
