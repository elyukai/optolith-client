import classNames from 'classnames';
import * as React from 'react';
import { findDOMNode } from 'react-dom';

export interface OverlayProps {
	className?: string;
	margin?: number;
	node?: React.ReactNode;
	position?: 'top' | 'bottom' | 'left' | 'right';
	trigger: Element;
}

interface OverlayState {
	position?: string;
	style: any;
}

export class Overlay extends React.Component<OverlayProps, OverlayState> {
	state = {
		style: {},
		position: ''
	};

	overlayRef: Element;

	alignToElement = () => {
		const { margin = 0, position, trigger } = this.props;
		const triggerCoordinates = trigger.getBoundingClientRect();
		const overlayCoordinates = this.overlayRef.getBoundingClientRect();
		let top = 0;
		let left = 0;

		const setHorizonally = () => {
			left = Math.max(0, triggerCoordinates.left + triggerCoordinates.width / 2 - overlayCoordinates.width / 2);
			const right = window.innerWidth - overlayCoordinates.width - left;
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
			const bottom = window.innerHeight - overlayCoordinates.height - top;
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
	}

	componentDidMount() {
		this.alignToElement();
	}

	render() {
		const { children, className, ...other } = this.props;
		const { position, style } = this.state;

		delete other.margin;
		delete other.node;
		delete other.position;
		delete other.trigger;

		const newOther = { ...other, style };

		return (
			<div
				{...newOther}
				className={classNames(this.props.className, 'overlay', 'overlay-' + position)}
				ref={node => this.overlayRef = findDOMNode(node)}
				>
				{children}
			</div>
		);
	}
}
