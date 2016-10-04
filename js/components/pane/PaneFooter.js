import React, { Component } from 'react';

class PaneFooter extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="pane-footer">
				<a className="link-button" href="http://forum.dsa-sh.de/index.php?p=/discussions" target="_blank">Forum</a>
				<a className="link-button" href="http://forum.dsa-sh.de/index.php?p=/discussion/48/cha5app-wip" target="_blank">Bug melden</a>
				<span className="app-version">v0.1-371</span>
			</div>
		);
	}
}

export default PaneFooter;
