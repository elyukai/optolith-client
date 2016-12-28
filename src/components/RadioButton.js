import Activate from './Activate';
import Icon from './Icon';
import React, { Component, PropTypes } from 'react';
import Text from './Text';

export default class RadioButton extends Component {

	static propTypes = {
		active: PropTypes.bool.isRequired,
		className: PropTypes.string,
		label: PropTypes.string,
		onClick: PropTypes.func.isRequired
	};

	render() {

		const { children, label, onClick, ...other } = this.props;

		return (
			<Activate {...other} className="radio" onClick={onClick}>
				<Icon>
					<div className="border"></div>
					<div className="dot"></div>
				</Icon>
				<Text>
					{label || children}
				</Text>
			</Activate>
		);
	}
}
