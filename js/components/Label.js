import React, { Component, PropTypes } from 'react';

export default class Label extends Component {

	static propTypes = {
		text: PropTypes.string
	};

	render() {

		let { text } = this.props;

		return text ? (
			<label>{text}</label>
		) : null;
	}
}
