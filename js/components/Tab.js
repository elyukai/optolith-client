import Text from './Text';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Tab extends Component {

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
