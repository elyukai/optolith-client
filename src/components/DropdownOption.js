import Activate from './Activate';
import Icon from './Icon';
import React, { Component, PropTypes } from 'react';
import Text from './Text';

export default class RadioButton extends Component {

	static propTypes = {
		active: PropTypes.bool.isRequired,
		className: PropTypes.string,
		label: PropTypes.string,
		onClick: PropTypes.func.isRequired,
		value: PropTypes.any.isRequired
	};

	render() {

		const { label, onClick, value, ...other } = this.props;

		return (
			<Activate {...other} className="radio" onClick={onClick} value={value}>
				<Text>
					{label}
				</Text>
				<Icon />
			</Activate>
		);
	}
}
