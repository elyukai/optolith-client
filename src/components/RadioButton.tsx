import { Component, PropTypes } from 'react';
import * as React from 'react';
import Activate from './Activate';
import Icon from './Icon';
import Text from './Text';

interface Props {
	active: boolean;
	className?: string;
	disabled?: boolean;
	label?: string;
	onClick: (event: React.MouseEvent<any>) => void;
	value?: string | number;
};

export default class RadioButton extends Component<Props, any> {

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
