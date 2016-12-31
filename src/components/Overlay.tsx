import { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import * as React from 'react';
import classNames from 'classnames';

interface Props {
	className?: string;
	margin?: number;
	node?: React.ReactNode;
	position?: string;
	trigger: Element;
}

interface State {
	position: string;
	style: any;
}

export default class Overlay extends Component<Props, State> {

	static propTypes = {
		className: PropTypes.string,
		margin: PropTypes.number,
		position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
		trigger: PropTypes.any
	};

	static defaultProps = {
		margin: 0
	};

	state = {
		style: {},
		position: ''
	};

	overlayRef: Element;

	alignToElement = () => {
		const { margin, position, trigger } = this.props;
		const triggerCoordinates = trigger.getBoundingClientRect();
		const overlayCoordinates = this.overlayRef.getBoundingClientRect();
		var top,
			left;

		const setHorizonally = () => {
			left = Math.max(0, triggerCoordinates.left + triggerCoordinates.width / 2 - overlayCoordinates.width / 2);
			let right = window.innerWidth - overlayCoordinates.width - left;
			if (right < 0) {
				left = Math.max(left, left + right);
			}
		};

		const setForTop = () => {
			top = triggerCoordinates.top - overlayCoordinates.height - margin;
			setHorizonally();
		};

		const setForBottom = () => {
			top = triggerCoordinates.top + triggerCoordinates.height + margin;
			setHorizonally();
		};

		const setVertically = () => {
			top = Math.max(0, triggerCoordinates.top + triggerCoordinates.height / 2 - overlayCoordinates.height / 2);
			let bottom = window.innerHeight - overlayCoordinates.height - top;
			if (bottom < 0) {
				top = Math.max(bottom, top + bottom);
			}
		};

		const setForLeft = () => {
			top = Math.max(0, triggerCoordinates.left + triggerCoordinates.width / 2 - overlayCoordinates.width / 2);
			setVertically();
		};

		const setForRight = () => {
			top = Math.max(0, triggerCoordinates.top + triggerCoordinates.height / 2 - overlayCoordinates.height / 2);
			setVertically();
		};

		let finalPosition = position;

		switch (position) {
			case 'top':
				setForTop();
				if (top < 0) {
					setForBottom();
					finalPosition = 'bottom';
				}
				break;
			case 'bottom':
				setForBottom();
				if (top + overlayCoordinates.height + margin > window.innerHeight) {
					setForTop();
					finalPosition = 'top';
				}
				break;
			case 'left':
				setForLeft();
				if (left < 0) {
					setForRight();
					finalPosition = 'right';
				}
				break;
			case 'right':
				setForRight();
				if (left + overlayCoordinates.width + margin > window.innerWidth) {
					setForLeft();
					finalPosition = 'left';
				}
				break;
		}

		this.setState({
			style: { top, left },
			position: finalPosition
		});
	};

	componentDidMount() {
		this.alignToElement();
	}
	
	render() {

		let { children, className, ...other } = this.props;
		let { position, style } = this.state;

		className = classNames(this.props.className, {
			'overlay': true,
			['overlay-' + position]: true
		});

		delete other.margin;
		delete other.node;
		delete other.position;
		delete other.trigger;

		let newOther = { ...other, style };

		return (
			<div {...newOther} className={className} ref={node => this.overlayRef = findDOMNode(node)}>
				{children}
			</div>
		);
	}
}
