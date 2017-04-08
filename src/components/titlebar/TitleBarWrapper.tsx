import * as React from 'react';
import TitleBarControls from './TitleBarControls';
import TitleBarDrag from './TitleBarDrag';

interface Props {
	children?: React.ReactNode;
}

export default function TitleBarWrapper(props: Props) {
	return (
		<div className="titlebar">
			<TitleBarDrag>
				<TitleBarControls/>
			</TitleBarDrag>
			<div className="titlebar-inner">
				{props.children}
			</div>
		</div>
	);
}
