import * as React from 'react';
import Dialog from '../components/Dialog';
import createOverlay from './createOverlay';

interface Button {
	label: string;
	primary?: boolean;
	autoWidth?: boolean;
	disabled?: boolean;
	onClick?(): void;
}

export default function(title: string, content?: string, buttons: Button[] = [{ label: 'OK', autoWidth: true }]): void {
	let className;
	if (typeof content !== 'string') {
		className = 'no-content';
	}
	createOverlay(
		<Dialog title={title} buttons={buttons} className={className}>{content}</Dialog>
	);
}
