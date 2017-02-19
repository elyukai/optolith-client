import * as React from 'react';
import Button from './Button';
import Icon from './Icon';

interface Props {
	onClick?: () => void;
	icon: string;
	flat?: boolean;
	[id: string]: any;
}

export default class IconButton extends React.Component<Props, undefined> {
	render() {

		const { icon, ...other } = this.props;

		return (
			<Button {...other} round>
				<Icon>{icon}</Icon>
			</Button>
		);
	}
}
