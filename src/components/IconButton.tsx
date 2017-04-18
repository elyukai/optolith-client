import * as React from 'react';
import Button from './Button';
import Icon from './Icon';

interface Props {
	icon: string;
	disabled?: boolean;
	flat?: boolean;
	onClick?(): void;
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
