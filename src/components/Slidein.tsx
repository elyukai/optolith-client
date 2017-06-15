import * as classNames from 'classnames';
import * as React from 'react';

export interface SlideinProps {
	close: () => void;
	isOpen: boolean;
}

export class Slidein extends React.Component<SlideinProps, {}> {
	shouldComponentUpdate(nextProps: SlideinProps) {
		return nextProps.isOpen !== this.props.isOpen || this.props.isOpen === true;
	}

	render() {
		const { children, close, isOpen } = this.props;
		const className = classNames('slidein-backdrop', { 'slidein-open': isOpen });
		return (
			<div className={className}>
				<div className="slidein">
					<div className="slidein-close" onClick={close}><div>&#xE5CD;</div></div>
						{
							isOpen ? (
								<div className="slidein-content">
									{children}
								</div>
							) : null
						}
				</div>
			</div>
		);
	}
}
