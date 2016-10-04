import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Box extends Component {

	static propTypes = {
		className: PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	render() {

		let { children, className, ...other } = this.props;

		className = classNames( 'box', className );

		return (
			<div {...other} className={className}>
				{children}
			</div>
		);
	}
}

export default Box;
