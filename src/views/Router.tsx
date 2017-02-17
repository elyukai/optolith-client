import { Component } from 'react';
import * as React from 'react';
import Loader from '../components/Loader';
import LoaderStore from '../stores/LoaderStore';
import Route from './Route';
import TabStore from '../stores/TabStore';
import TitleBar from '../components/titlebar/TitleBar';

interface State {
	isLoading: boolean;
	loadingText: string;
	section: string;
	tab: string;
}

export default class Router extends Component<{}, State> {

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

		return (
			<div id="body">
				<Loader isLoading={isLoading} text={loadingText} />
				<TitleBar currentSection={section} currentTab={tab} />
				<Route id={tab} />
			</div>
		);
	}
}
