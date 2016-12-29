import { Component, PropTypes } from 'react';
import * as React from 'react';
import Button from './Button';
import Text from './Text';

interface Props {
	label: string;
	[propType: string]: any;
}

export default class BorderButton extends Component<Props, any> {

	static propTypes = {
		label: PropTypes.string
	};

	render() {

		const { children, label, ...other } = this.props;

		return (
			<Button {...other}>
				<Text>{label || children}</Text>
			</Button>
		);
	}
}
