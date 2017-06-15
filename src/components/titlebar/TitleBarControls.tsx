import { remote } from 'electron';
import * as React from 'react';
import { setSection } from '../../actions/LocationActions';
import { ELStore } from '../../stores/ELStore';
import { HistoryStore } from '../../stores/HistoryStore';
import { alert } from '../../utils/alert';
import { confirm } from '../../utils/confirm';
import { saveAll } from '../../utils/FileAPIUtils';
import { translate } from '../../utils/I18n';

function minimize() {
	remote.getCurrentWindow().minimize();
}

function close() {
	const safeToExit = ELStore.getStartID() === 'EL_0' || !HistoryStore.isUndoAvailable();
	if (safeToExit) {
		saveAll();
		alert(translate('fileapi.allsaved'), () => {
			remote.getCurrentWindow().close();
		});
	}
	else {
		confirm(translate('heroes.warnings.unsavedactions.title'), translate('heroes.warnings.unsavedactions.text'), true).then(result => {
			if (result === true) {
				saveAll();
				alert(translate('fileapi.everythingelsesaved'), () => {
					remote.getCurrentWindow().close();
				});
			}
			else {
				setSection('hero');
			}
		});
	}
}

export function TitleBarControls() {
	return (
		<div className="titlebar-controls">
			<div className="titlebar-controls-btn" onClick={minimize}>&#xE15B;</div>
			<div className="titlebar-controls-btn" onClick={close}>&#xE5CD;</div>
		</div>
	);
}
