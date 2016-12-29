// import PerfectScrollbar from 'react-perfect-scrollbar';
import { Component, PropTypes } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import GeminiScrollbar from 'react-gemini-scrollbar';

interface Props {
	className?: string;
}

export default class Scroll extends Component<Props, any> {

	static propTypes = {
		className: PropTypes.string
	};

	render() {

		const { className, ...other } = this.props;

		return (
			<GeminiScrollbar className={classNames('scroll-' + className, 'scroll')}>
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
