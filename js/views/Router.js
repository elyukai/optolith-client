import React, { Component } from 'react';
import Route from './Route';
import TabStore from '../stores/TabStore';
import TitleBar from './TitleBar';
import Wait from './Wait';
import WaitStore from '../stores/WaitStore';

class Router extends Component {

	state = {
		section: TabStore.getCurrentSID(),
		tab: TabStore.getCurrentID(),
		wait: WaitStore.getWaiting()
	};

	_updateTabStore = () => this.setState({ section: TabStore.getCurrentSID(), tab: TabStore.getCurrentID() });
	_updateWaitStore = () => this.setState({ wait: WaitStore.getWaiting() });

	componentDidMount() {
		TabStore.addChangeListener(this._updateTabStore);
		WaitStore.addChangeListener(this._updateWaitStore);
	}

	componentWillUnmount() {
		TabStore.removeChangeListener(this._updateTabStore);
		WaitStore.removeChangeListener(this._updateWaitStore);
	}

	render() {

		const { section, tab, wait } = this.state;

		return (
			<div id="body">
				<Wait show={wait} />
				<main>
					<TitleBar section={section} tab={tab} />
					<Route id={tab} />
				</main>
			</div>
		);
	}
}

export default Router;
