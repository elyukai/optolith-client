import { remote } from 'electron';
import * as React from 'react';
import Dialog from '../components/Dialog';
import { close } from '../utils/createOverlay';
import createOverlay from './createOverlay';

interface Button {
	label: string;
	primary?: boolean;
	autoWidth?: boolean;
	disabled?: boolean;
	onClick?(): void;
}
export default function alert(title: string, expand?: (() => void) | string, buttons: Button[] = [{ label: 'OK', autoWidth: true }]): void {
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
