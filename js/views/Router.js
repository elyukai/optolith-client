import Loader from '../components/Loader';
import LoaderStore from '../stores/LoaderStore';
import React, { Component } from 'react';
import Route from './Route';
import TabStore from '../stores/TabStore';
import TitleBar from '../components/titlebar/TitleBar';

export default class Router extends Component {

	state = {
		tabs: TabStore.getAll(),
		isLoading: LoaderStore.isLoading(),
		loadingText: LoaderStore.getLoadingText()
	};

	_updateLoaderStore = () => this.setState({
		isLoading: LoaderStore.isLoading(),
		loadingText: LoaderStore.getLoadingText()
	});
	_updateTabStore = () => this.setState({ tabs: TabStore.getAll() });

	componentDidMount() {
		LoaderStore.addChangeListener(this._updateLoaderStore);
		TabStore.addChangeListener(this._updateTabStore);
	}

	componentWillUnmount() {
		LoaderStore.removeChangeListener(this._updateLoaderStore);
		TabStore.removeChangeListener(this._updateTabStore);
	}

	render() {

		const { isLoading, loadingText, tabs: { section, tab } } = this.state;

		return (
			<div id="body">
				<Loader isLoading={isLoading} text={loadingText} />
				<main>
					<TitleBar currentSection={section} currentTab={tab} />
					<Route id={tab} />
				</main>
			</div>
		);
	}
}
