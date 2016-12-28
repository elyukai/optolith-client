import Button from './Button';
import Text from './Text';
import React, { Component, PropTypes } from 'react';

export default class BorderButton extends Component {

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
