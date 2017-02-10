import { Component, PropTypes } from 'react';
import * as React from 'react';
import classNames from 'classnames';

interface Props {
	className?: string;
	disabled?: boolean;
	text?: string;
}

export default class Label extends Component<Props, undefined> {
	render() {
		const { className, disabled, text, ...other } = this.props;

		return text ? (
			<label {...other} className={classNames(className, disabled && 'disabled')}>{text}</label>
		) : null;
	}
}
