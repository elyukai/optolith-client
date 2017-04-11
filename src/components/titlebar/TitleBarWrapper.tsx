import { remote } from 'electron';
import * as React from 'react';
import TitleBarControls from './TitleBarControls';
import TitleBarDrag from './TitleBarDrag';

interface Props {
	children?: React.ReactNode;
}

export default function TitleBarWrapper(props: Props) {
	const controlsElement = remote.process.platform !== 'darwin' && <TitleBarControls/>;

	return (
		<div className="titlebar">
			<TitleBarDrag>
				{controlsElement}
			</TitleBarDrag>
			<div className="titlebar-inner">
				{props.children}
			</div>
		</div>
	);
}
