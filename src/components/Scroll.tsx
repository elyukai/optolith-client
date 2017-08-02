import * as classNames from 'classnames';
import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';

export interface ScrollProps {
	children?: React.ReactNode;
	className?: string;
	noInnerElement?: boolean;
}

export class Scroll extends React.Component<ScrollProps> {
	render() {
		const { className, children, noInnerElement, ...other } = this.props;
		return (
			<Scrollbars
				className={classNames(className && 'scroll-' + className, 'scroll')}
				renderThumbHorizontal={props => <div {...props} className="thumb thumb-horizontal"></div>}
				renderThumbVertical={props => <div {...props} className="thumb thumb-vertical"></div>}
				renderTrackHorizontal={props => <div {...props} style={{ ...props.style, height: 11 }} className="track track-horizontal"></div>}
				renderTrackVertical={props => <div {...props} style={{ ...props.style, width: 11 }} className="track track-vertical"></div>}
				renderView={props => <div {...props} className="scroll-view"></div>}
				>
				{!noInnerElement ? <div {...other} className="scroll-inner">
					{children}
				</div> : children}
			</Scrollbars>
		);
	}
}
