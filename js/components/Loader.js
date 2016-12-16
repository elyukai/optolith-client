import React, { Component, PropTypes } from 'react';

export default class Loader extends Component {
	
	static propTypes = {
		isLoading: PropTypes.bool.isRequired
	};

	render() {
		return this.props.isLoading ? <div id="loader"><div></div></div> : null;
	}
}
