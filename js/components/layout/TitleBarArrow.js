import React, { Component, PropTypes } from 'react';

class TitleBarArrow extends Component {

	static propTypes = {
		onClick: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<svg width="19px" height="19px" onClick={this.props.onClick} >
				<path d="M8,11V0H0v19h19v-8H8z M17,17H2V2h4v11h11V17z"/>
			</svg>
		);
	}
}

export default TitleBarArrow;
