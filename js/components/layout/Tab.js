import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Tab extends Component {

	static propTypes = {
		className: PropTypes.any,
		label: PropTypes.any,
		active: PropTypes.bool,
		onClick: PropTypes.func
	};

	constructor(props) {
		super(props);
	}

	render() {

		const { disabled, active, label, children, onClick } = this.props;

		const className = classNames('tab', disabled && 'disabled', active && 'active', this.props.className);

		if (label) {
			return (
				<div className={className} onClick={disabled ? undefined : onClick}>
					<div>{label}</div>
				</div>
			);
		}

		return (
			<div className={className} onClick={onClick}>
				{children}
			</div>
		);
	}
}

export default Tab;
