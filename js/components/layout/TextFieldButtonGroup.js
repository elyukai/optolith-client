import React, { Component } from 'react';

class TextFieldButtonGroup extends Component {
	render() {
		return (
			<div className="textfield-btn-group">
				{this.props.children}
			</div>
		);
	}
}

export default TextFieldButtonGroup;
