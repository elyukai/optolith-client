import React, { Component } from 'react';
import Route from './Route';
import TabStore from '../stores/TabStore';
import TitleBar from '../components/titlebar/TitleBar';
import Loader from '../components/Loader';
import WaitStore from '../stores/WaitStore';

export default class Router extends Component {

	state = {
		tabs: TabStore.getAll(),
		isWaiting: WaitStore.isWaiting()
	};

	_updateTabStore = () => this.setState({ tabs: TabStore.getAll() });
	_updateWaitStore = () => this.setState({ isWaiting: WaitStore.isWaiting() });

	componentDidMount() {
		TabStore.addChangeListener(this._updateTabStore);
		WaitStore.addChangeListener(this._updateWaitStore);
	}

	componentWillUnmount() {
		TabStore.removeChangeListener(this._updateTabStore);
		WaitStore.removeChangeListener(this._updateWaitStore);
	}

	render() {

		const { isWaiting, tabs: { section, tab } } = this.state;

		return (
			<div id="body">
				<Loader isLoading={isWaiting} />
				<main>
					<TitleBar currentSection={section} currentTab={tab} />
					<Route id={tab} />
				</main>
			</div>
		);
	}
}
