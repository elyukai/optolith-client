import * as React from 'react';
import Dialog from '../components/Dialog';
import createOverlay from './createOverlay';

interface Button {
	label: string;
	primary?: boolean;
	disabled?: boolean;
	onClick?(): void;
}

export default function(title: string, content?: string, buttons?: Button[]): void {
	createOverlay(
		<Dialog title={title} buttons={buttons}>{content}</Dialog>
	);
}
