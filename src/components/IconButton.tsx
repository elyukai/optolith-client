import { Component, PropTypes } from 'react';
import * as React from 'react';
import Button from './Button';
import Icon from './Icon';

interface Props {
	icon: string;
	[propName: string]: any;
}

export default class IconButton extends Component<Props, any> {

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
