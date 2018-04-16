import classNames = require('classnames');
import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../reducers/app';
import { getTheme } from '../selectors/uisettingsSelectors';
import { close, createOverlay } from '../utils/createOverlay';
import { Overlay } from './Overlay';

export interface TooltipToggleOwnProps {
	content: React.ReactNode;
	margin?: number;
	small?: boolean;
	position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface TooltipToggleStateProps {
	theme: string;
}

export interface TooltipToggleDispatchProps {
}

export type TooltipToggleProps = TooltipToggleStateProps & TooltipToggleDispatchProps & TooltipToggleOwnProps;

export class TooltipToggleWrapped extends React.Component<TooltipToggleProps, {}> {
	node?: HTMLElement;

	componentWillUnmount() {
		if (this.node) {
			close(this.node);
		}
	}

	open = (event: React.MouseEvent<HTMLElement>) => {
		const { content, margin, position = 'top', small, theme } = this.props;
		this.node = createOverlay(<Overlay className={classNames('tooltip', `theme-${theme}`, small && 'tooltip-small')} position={position} trigger={event.currentTarget} margin={margin}>
			{content}
		</Overlay>);
	}

	close = () => {
		if (this.node) {
			close(this.node);
			this.node = undefined;
		}
	}

	render() {
		const { children } = this.props;
		return React.cloneElement(React.Children.only(children), {
			onMouseOver: this.open,
			onMouseOut: this.close
		});
	}
}

function mapStateToProps(state: AppState) {
	return {
		theme: getTheme(state)
	};
}


export const TooltipToggle = connect<TooltipToggleStateProps, TooltipToggleDispatchProps, TooltipToggleOwnProps>(mapStateToProps)(TooltipToggleWrapped);
