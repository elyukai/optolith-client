import GeminiScrollbar from 'react-gemini-scrollbar';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Slidein extends Component {

	static propTypes = {
		isOpen: PropTypes.bool
	};

	shouldComponentUpdate(nextProps) {
		return nextProps.isOpen !== this.props.isOpen || this.props.isOpen === true;
	}

	render() {

		const className = classNames('slidein-backdrop', { 'slidein-open': this.props.isOpen });

		return (
			<div className={className}>
				<div className="slidein">
					<div className="slidein-close" onClick={this.props.close}><div>&#xE5CD;</div></div>
					<div className="slidein-content">
						{
							this.props.isOpen ? this.props.children : null
						}
					</div>
				</div>
			</div>
		);
	}
}

export default Slidein;
