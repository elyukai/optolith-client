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

	constructor(props) {
		super(props);
	}

	render() {

		const className = classNames('iconbutton', this.props.primary && 'primary', this.props.disabled && 'disabled',  this.props.className);

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
