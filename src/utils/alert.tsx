import createOverlay from './createOverlay';
import Dialog from '../components/Dialog';
import * as React from 'react';

export default function(title: string, content?: string, buttons?: Object[]): void {
	createOverlay(
		<Dialog title={title} buttons={buttons}>{content}</Dialog>
	);
}
