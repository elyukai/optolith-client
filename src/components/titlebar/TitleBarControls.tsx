import { remote } from 'electron';
import * as React from 'react';

interface Props {
	children?: React.ReactNode;
}

function close() {
	remote.getCurrentWindow().close();
}

export default function TitleBarDrag() {
	return (
		<div className="titlebar-controls">
			<div className="titlebar-controls-btn" onClick={close}>&#xE5CD;</div>
		</div>
	);
}
