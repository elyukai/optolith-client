import createOverlay from './createOverlay';
import Dialog from '../components/Dialog';
import * as React from 'react';

interface Button {
	label: string;
	onClick?: () => void;
	primary?: boolean;
	disabled?: boolean;
}

export default function(title: string, content?: string, buttons?: Button[]): void {
	createOverlay(
		<Dialog title={title} buttons={buttons}>{content}</Dialog>
	);
}
