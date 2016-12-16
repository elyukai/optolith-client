import Button from './Button';
import Icon from './Icon';
import React, { Component, PropTypes } from 'react';

export default class IconButton extends Component {

	static propTypes = {
		icon: PropTypes.string
	};

	render() {
		
		const { icon, ...other } = this.props;

		return (
			<Button {...other} round>
				<Icon>{icon}</Icon>
			</Button>
		);
	}
}
