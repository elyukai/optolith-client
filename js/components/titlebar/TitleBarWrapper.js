import React, { Component } from 'react';

export default class TitleBarWrapper extends Component {

	render() {
		return (
			<div className="titlebar">
				<div className="titlebar-inner">
					{this.props.children}
				</div>
			</div>
		);
	}
}
