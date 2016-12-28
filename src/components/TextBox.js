import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class TextBox extends Component {

	static propTypes = {
		className: PropTypes.string,
		label: PropTypes.string.isRequired,
		value: PropTypes.any
	};

	render() {

		const { children, label, value } = this.props;

		const className = classNames( 'textbox', this.props.className );

		return (
			<div className={className}>
				<h3>{label}</h3>
				{value ? <div>{value}</div> : children}
			</div>
		);
	}
}
