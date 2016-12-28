import React, { Component } from 'react';

export default class Text extends Component {

	static defaultProps = {
		className: 'text'
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
