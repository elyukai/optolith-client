import Icon from './Icon';
import React, { Component, PropTypes } from 'react';
import Text from './Text';

export default class Loader extends Component {
	
	static propTypes = {
		isLoading: PropTypes.bool.isRequired,
		text: PropTypes.string
	};

	render() {

		const { isLoading, text } = this.props;

		return isLoading ? <div id="loader"><Icon/><Text>{text}</Text></div> : null;
	}
}
