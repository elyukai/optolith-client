import { remote } from 'electron';
import * as React from 'react';
import { BorderButtonProps } from '../components/BorderButton';
import { Dialog } from '../components/Dialog';
import { close } from '../utils/createOverlay';
import { createOverlay } from './createOverlay';

export function alert(title: string, expand?: (() => void) | string, buttons: BorderButtonProps[] = [{ label: 'OK', autoWidth: true }]): void {
	let className;
	let content;
	if (typeof expand !== 'string') {
		className = 'no-content';
		buttons[0].onClick = expand;
	}
	else {
		content = expand;
	}
	const node = createOverlay(
		<Dialog title={title} buttons={buttons} className={className}>{content}</Dialog>
	);
	if (typeof expand !== 'string') {
		remote.globalShortcut.register('Enter', () => {
			remote.globalShortcut.unregister('Enter');
			close(node);
			if (typeof expand === 'function') {
				expand();
			}
		});
	}
}
