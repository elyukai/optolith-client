import { Component, PropTypes } from 'react';
import * as React from 'react';
import Activate from './Activate';
import classNames from 'classnames';
import Icon from './Icon';
import Text from './Text';

interface Props {
	checked: boolean;
	className?: string;
	label?: string;
	onClick: (event: React.MouseEvent<any>) => void;
}

export default class Checkbox extends Component<Props, any> {

	static propTypes = {
		checked: PropTypes.bool.isRequired,
		className: PropTypes.string,
		label: PropTypes.string,
		onClick: PropTypes.func.isRequired
	};

	render() {

		const { checked, children, className, label, onClick, ...other } = this.props;

		return (
			<Activate {...other} active={checked} className={classNames('checkbox', className)} onClick={onClick}>
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
