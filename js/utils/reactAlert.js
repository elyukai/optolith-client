import createOverlay from './createOverlay';
import Dialog from '../components/Dialog';
import React from 'react';

export default function(title, content, buttons) {
	createOverlay(
		<Dialog
			title={title}
			buttons={buttons}
			>
			{content}
		</Dialog>
	);
}
