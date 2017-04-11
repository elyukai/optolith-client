import { remote } from 'electron';
import * as React from 'react';
import { saveAll } from '../../utils/FileAPIUtils';

interface Props {
	children?: React.ReactNode;
}

function minimize() {
	remote.getCurrentWindow().minimize();
}

function close() {
	saveAll();
	remote.getCurrentWindow().close();
}

export default function TitleBarDrag() {
	return (
		<div className="titlebar-controls">
			<div className="titlebar-controls-btn" onClick={minimize}>&#xE15B;</div>
			<div className="titlebar-controls-btn" onClick={close}>&#xE5CD;</div>
		</div>
	);
}
