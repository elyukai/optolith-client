import * as React from 'react';
import Activate from './Activate';
import Icon from './Icon';
import Text from './Text';

interface Props {
	active: boolean;
	className?: string;
	disabled?: boolean;
	label?: string;
	onClick: () => void;
	value?: string | number | null;
};

export default class RadioButton extends React.Component<Props, undefined> {
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
