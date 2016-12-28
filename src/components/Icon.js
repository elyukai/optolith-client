import React, { Component } from 'react';

export default class Icon extends Component {

	static defaultProps = {
		className: 'icon'
	}

	render() {

		const { children, ...other } = this.props;
		
		return (
			<div {...other}>
				{children}
			</div>
		);
	}
}
