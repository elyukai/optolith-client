import { remote } from 'electron';
import * as React from 'react';
import { ELState } from '../../reducers/el';
import { UIMessages } from '../../types/ui.d';
import { alert } from '../../utils/alert';
import { confirm } from '../../utils/confirm';
import { saveAll } from '../../utils/FileAPIUtils';
import { _translate } from '../../utils/I18n';

function minimize() {
	remote.getCurrentWindow().minimize();
}

function close(locale: UIMessages | undefined, setSection: (id: string) => void, el: ELState, isUndoAvailable: boolean) {
	const safeToExit = typeof el.startId === 'string' || !isUndoAvailable;
	if (safeToExit) {
		saveAll();
		alert(_translate(locale, 'fileapi.allsaved'), () => {
			remote.getCurrentWindow().close();
		});
	}
	else {
		confirm(_translate(locale, 'heroes.warnings.unsavedactions.title'), _translate(locale, 'heroes.warnings.unsavedactions.text'), true).then(result => {
			if (result === true) {
				saveAll();
				alert(_translate(locale, 'fileapi.everythingelsesaved'), () => {
					remote.getCurrentWindow().close();
				});
			}
			else {
				setSection('hero');
			}
		});
	}
}

export interface TitleBarControlsProps {
	el: ELState;
	isUndoAvailable: boolean;
	locale?: UIMessages;
	setSection(id: string): void;
}

export function TitleBarControls(props: TitleBarControlsProps) {
	const { el, isUndoAvailable, locale, setSection } = props;
	return (
		<div className="titlebar-controls">
			<div className="titlebar-controls-btn" onClick={minimize}>&#xE15B;</div>
			<div className="titlebar-controls-btn" onClick={close.bind(null, locale, setSection, el, isUndoAvailable)}>&#xE5CD;</div>
		</div>
	);
}
