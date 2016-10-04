import React, { Component, PropTypes } from 'react';

class PaneUser extends Component {

	static propTypes = {
		name: PropTypes.string
	};
	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="pane-user">
				<h2>{this.props.name}</h2>
			</div>
		);
	}
}

export default PaneUser;
