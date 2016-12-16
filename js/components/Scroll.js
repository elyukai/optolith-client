import GeminiScrollbar from 'react-gemini-scrollbar';
// import PerfectScrollbar from 'react-perfect-scrollbar';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Scroll extends Component {

	static propTypes = {
		className: PropTypes.string
	}

	render() {

		let { className, ...other } = this.props;

		className = classNames('scroll-' + this.props.className, 'scroll');

		return (
			<GeminiScrollbar className={className}>
				<div {...other} className="scroll-inner">
					{this.props.children}
				</div>
			</GeminiScrollbar>
		);
		// return (
		// 	<PerfectScrollbar option={{ theme: 'tde' }}>
		// 		<div {...other} className={className}>
		// 			{this.props.children}
		// 		</div>
		// 	</PerfectScrollbar>
		// );
	}
}
