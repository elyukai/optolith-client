import Content from './content/Content';
import React, { Component } from 'react';
import TabStore from '../stores/TabStore';
import WaitStore from '../stores/WaitStore';

class AppController extends Component {

	state = {
		section: TabStore.getCurrentSID(),
		tab: TabStore.getCurrentID(),
		wait: WaitStore.getWaiting()
	};

	constructor(props) {
		super(props);
	}

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

		const waitElement = wait ? (
			<div className="wait"><div></div></div>
		) : null;

		return (
			<div id="body">
				{waitElement}
				<Content tab={tab} section={section} />
			</div>
		);
	}
}

export default AppController;
