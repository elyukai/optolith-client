import { Component, PropTypes } from 'react';
import * as React from 'react';
import Icon from './Icon';
import Text from './Text';

interface Props {
	isLoading: boolean;
	text?: string;
}

export default class Loader extends Component<Props, any> {
	
	static propTypes = {
		isLoading: PropTypes.bool.isRequired,
		text: PropTypes.string
	};

	render() {

		const { isLoading, text } = this.props;

		return isLoading ? <div id="loader"><Icon/><Text>{text}</Text></div> : null;
	}
}
