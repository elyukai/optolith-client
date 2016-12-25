import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class Label extends Component {

	static propTypes = {
		className: PropTypes.string,
		disabled: PropTypes.bool,
		text: PropTypes.string
	};

	render() {

		let { className, disabled, text, ...other } = this.props;

		return text ? (
			<label {...other} className={classNames(className, disabled && 'disabled')}>{text}</label>
		) : null;
	}
}
