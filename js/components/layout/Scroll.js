import React, { Component, PropTypes } from 'react';
import GeminiScrollbar from 'react-gemini-scrollbar';
import classNames from 'classnames';

class Scroll extends Component {

	static propTypes = {
		className: PropTypes.any
	}

	constructor(props) {
		super(props);
	}

	render() {

		const className = classNames('scroll', this.props.className);

		return (
			<GeminiScrollbar className={className}>
				<div className="scroll-inner">
					{this.props.children}
				</div>
			</GeminiScrollbar>
		);
	}
}

export default Scroll;
