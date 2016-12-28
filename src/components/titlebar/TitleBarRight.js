import React, { Component } from 'react';

export default class TitleBarRight extends Component {

	render() {
		return (
			<div className="titlebar-right">
				{this.props.children}
			</div>
		);
	}
}
