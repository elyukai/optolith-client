import * as classNames from 'classnames';
import * as React from 'react';
import { Portal } from './Portal';

export interface SlideinProps {
	isOpened: boolean;
	close(): void;
}

export class Slidein extends React.Component<SlideinProps, {}> {
	shouldComponentUpdate(nextProps: SlideinProps) {
		return nextProps.isOpened !== this.props.isOpened || this.props.isOpened === true;
	}

	render() {
		const { children, close, ...other } = this.props;
		const className = classNames('slidein-backdrop');
		return (
			<Portal {...other} className={className}>
				<div className="slidein">
					<div className="slidein-close" onClick={close}><div>&#xE5CD;</div></div>
						<div className="slidein-content">
							{children}
						</div>
				</div>
			</Portal>
		);
	}
}
