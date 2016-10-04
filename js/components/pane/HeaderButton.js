import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class HeaderButton extends Component {
	
	static propTypes = {
		icon: PropTypes.string.isRequired,
		isOpen: PropTypes.any,
		func: PropTypes.func.isRequired,
		tag: PropTypes.string
	};

	constructor(props) {
		super(props);
	}
	
	render() {
		if (this.props.tag) {
			const className = classNames('pane-button', this.props.isOpen && 'active');
			
			return (
				<div className={className} onClick={this.props.func.bind(null, this.props.tag)}>{this.props.icon}</div>
			);
		}
		return (
			<div className="pane-button" onClick={this.props.func}>{this.props.icon}</div>
		);
	}
}

export default HeaderButton;
