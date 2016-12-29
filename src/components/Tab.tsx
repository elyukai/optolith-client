import { Component, PropTypes } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import Text from './Text';

interface Props {
	active: boolean,
	className?: string,
	disabled?: boolean,
	label: string,
	onClick: () => void
}

export default class TabProps extends Component<Props, any> {

	static propTypes = {
		active: PropTypes.bool,
		className: PropTypes.any,
		disabled: PropTypes.bool,
		label: PropTypes.any,
		onClick: PropTypes.func
	};

	render() {

		const { active, children, disabled, label, onClick } = this.props;

		const className = classNames(this.props.className, {
			'tab': true,
			'disabled': disabled,
			'active': active
		});

		return (
			<div className={className} onClick={disabled ? undefined : onClick}>
				<Text>{label || children}</Text>
			</div>
		);
	}
}
