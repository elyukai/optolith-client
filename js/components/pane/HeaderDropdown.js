import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class HeaderDropdown extends Component {
	
	static propTypes = {
		className: PropTypes.any,
		isOpen: PropTypes.bool.isRequired
	};

	constructor(props) {
		super(props);
	}
	
	render() {

		const className = classNames('header-dropdown', this.props.className);

		return this.props.isOpen ? (
			<div className={className}>
				{this.props.children}
			</div>
		) : null;
	}
}

export default HeaderDropdown;
