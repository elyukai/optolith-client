import * as React from 'react';
import Dialog from '../components/Dialog';
import createOverlay from './createOverlay';

interface Button {
	label: string;
	primary?: boolean;
	disabled?: boolean;
	onClick?(): void;
}

export default function confirm(title: string, content?: string, yesno?: boolean): Promise<boolean> {
	return new Promise<boolean>(resolve => {
		const accept = () => resolve(true);
		const decline = () => resolve(false);
		createOverlay(
			<Dialog
				title={title}
				buttons={[
					{
						label: yesno ? 'Ja' : 'OK',
						onClick: accept
					},
					{
						label: yesno ? 'Nein' : 'Abbrechen',
						onClick: decline
					}
				]}
				>
				{content}
			</Dialog>
		);
	});
}
