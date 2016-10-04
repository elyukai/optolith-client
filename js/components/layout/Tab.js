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

		const className = classNames('tab', this.props.disabled && 'disabled', this.props.active && 'active', this.props.className);

		if (this.props.label) {
			return (
				<div className={className} onClick={this.props.onClick}>
					<div>{this.props.label}</div>
				</div>
			);
		}

		return (
			<div className={className} onClick={this.props.onClick}>
				{this.props.children}
			</div>
		);
	}
}

export default Tab;
