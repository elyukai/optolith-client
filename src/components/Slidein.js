import Scroll from './Scroll';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Slidein extends Component {

	static propTypes = {
		close: PropTypes.func.isRequired,
		isOpen: PropTypes.bool
	};

	shouldComponentUpdate(nextProps) {
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
