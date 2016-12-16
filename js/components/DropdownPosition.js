import GeminiScrollbar from 'react-gemini-scrollbar';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class DropdownPosition extends Component {

	static propTypes = {
		dropElement: PropTypes.element,
		isOpen: PropTypes.bool,
		position: PropTypes.string,
		trigger: PropTypes.element
	};

	render() {

		const { dropElement, isOpen, position, trigger, ...other } = this.props;

		const placeholderElement = <div style={{height:0}}></div>;

		const selectPosition = p => position === p && isOpen ? dropElement : placeholderElement;

		const top = selectPosition('top');
		const bottom = selectPosition('bottom');

		return (
			<div {...other}>
				{top}
				{trigger}
				{bottom}
			</div>
		);
	}
}
