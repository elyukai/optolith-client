import React, { Component } from 'react';

class ToolBar extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="toolbar">
				<div className="toolbar-inner">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default ToolBar;
