import React, { Component } from 'react';

export default class TitleBarLeft extends Component {

	render() {
		return (
			<div className="titlebar-left">
				{this.props.children}
			</div>
		);
	}
}
