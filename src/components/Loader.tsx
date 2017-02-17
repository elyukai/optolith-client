import * as React from 'react';
import Icon from './Icon';
import Text from './Text';

interface Props {
	isLoading: boolean;
	text?: string;
}

export default class Loader extends React.Component<Props, undefined> {
	render() {
		const { isLoading, text } = this.props;
		return isLoading ? <div id="loader"><Icon/><Text>{text}</Text></div> : null;
	}
}
