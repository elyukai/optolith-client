// import { PerfectScrollbar } from 'react-perfect-scrollbar';
import classNames from 'classnames';
import * as React from 'react';
import GeminiScrollbar from 'react-gemini-scrollbar';

export interface ScrollProps {
	children?: React.ReactNode;
	className?: string;
}

export function Scroll(props: ScrollProps) {
	const { className, children, ...other } = props;
	return (
		<GeminiScrollbar className={classNames(className && 'scroll-' + className, 'scroll')}>
			<div {...other} className="scroll-inner">
				{children}
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
