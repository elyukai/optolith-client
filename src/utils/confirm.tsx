import * as React from 'react';
import { Dialog } from '../components/Dialog';
import { createOverlay } from './createOverlay';
import { _translate, UIMessages } from './I18n';

export function confirm(message: string, theme: string, locale: UIMessages, title: string | undefined, yesno?: boolean): Promise<boolean> {
	return new Promise<boolean>(resolve => {
		const accept = () => resolve(true);
		const decline = () => resolve(false);
		createOverlay(
			<Dialog
				title={title}
				buttons={[
					{
						label: yesno ? _translate(locale, 'yes') : _translate(locale, 'ok'),
						onClick: accept
					},
					{
						label: yesno ? _translate(locale, 'no') : _translate(locale, 'cancel'),
						onClick: decline
					}
				]}
				className={`theme-${theme}`}
				>
				{message}
			</Dialog>
		);
	});
}
