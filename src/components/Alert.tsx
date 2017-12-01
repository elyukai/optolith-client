import { remote } from 'electron';
import * as React from 'react';
import { Action } from 'redux';
import { Alert as AlertOptions, UIMessages, ViewAlertButton } from '../types/data.d';
import { _translate } from '../utils/I18n';
import { Dialog } from './DialogNew';

export interface AlertProps {
	locale: UIMessages;
	options: AlertOptions | null;
	close(): void;
	dispatch(action: Action): void;
}

export function Alert(props: AlertProps) {
	const { close, dispatch, options, locale } = props;
	let buttons: ViewAlertButton[] | undefined;
	let message;
	let title;
	let onClose: (() => void) | undefined;

	if (options) {
		const {
			buttons: buttonsOption = [{ label: 'OK', autoWidth: true }],
			message: messageOption,
			title: titleOption,
			confirm,
			confirmYesNo,
			onClose: onCloseOption
		} = options;

		buttons = (confirm ? [
			{
				label: confirmYesNo ? _translate(locale, 'yes') : _translate(locale, 'ok'),
				dispatchOnClick: confirm[0]
			},
			{
				label: confirmYesNo ? _translate(locale, 'no') : _translate(locale, 'cancel'),
				dispatchOnClick: confirm[1]
			}
		] : buttonsOption).map(e => {
			const { dispatchOnClick, ...other } = e;
			return { ...other, onClick: () => {
				if (dispatchOnClick) {
					dispatch(dispatchOnClick);
				}
			}};
		});
		message = messageOption;
		title = titleOption;
		onClose = onCloseOption;
	}

	const closeEnhanced = () => {
		if (remote.globalShortcut.isRegistered('Enter')) {
			remote.globalShortcut.unregister('Enter');
		}
		if (onClose) {
			onClose();
		}
		close();
	};

	if (buttons && buttons.length === 1) {
		remote.globalShortcut.register('Enter', () => {
			remote.globalShortcut.unregister('Enter');
			closeEnhanced();
		});
	}

	return (
		<Dialog
			close={closeEnhanced}
			buttons={buttons}
			isOpened={options !== null}
			className="alert"
			title={title}
			>
			{message}
		</Dialog>
	);
}
