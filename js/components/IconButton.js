import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class IconButton extends Component {

	static propTypes = {
		className: PropTypes.any,
		disabled: PropTypes.bool,
		icon: PropTypes.string,
		onClick: PropTypes.func,
		primary: PropTypes.bool
	};

	render() {

		const className = classNames('btn-icon', this.props.primary && 'btn-primary', this.props.disabled && 'disabled',  this.props.className);

		return (
			<div className={className} onClick={this.props.onClick}>
				<div>
					{this.props.icon}
				</div>
			</div>
		);
	}
}

export default IconButton;
