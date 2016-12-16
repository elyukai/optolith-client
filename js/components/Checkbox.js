import Activate from './Activate';
import Icon from './Icon';
import React, { Component, PropTypes } from 'react';
import Text from './Text';

export default class Checkbox extends Component {

	static propTypes = {
		checked: PropTypes.bool.isRequired,
		className: PropTypes.string,
		label: PropTypes.string,
		onClick: PropTypes.func.isRequired
	};

	render() {

		const { checked, children, label, onClick, ...other } = this.props;

		return (
			<Activate {...other} active={checked} className="checkbox" onClick={onClick}>
				<Icon>
					<div className="border"></div>
					<div className="hook"></div>
				</Icon>
				<Text>
					{label || children}
				</Text>
			</Activate>
		);
	}
}
