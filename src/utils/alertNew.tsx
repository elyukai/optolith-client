import { remote } from 'electron';
import * as React from 'react';
import { BorderButtonProps } from '../components/BorderButton';
import { Dialog } from '../components/Dialog';
import { close } from '../utils/createOverlay';
import { createOverlay } from './createOverlay';

export function alert(message: string, theme: string): Promise<void>;
export function alert(message: string, theme: string, title: string): Promise<void>;
export function alert(message: string, theme: string, buttons: BorderButtonProps[]): Promise<void>;
export function alert(message: string, theme: string, title: string, buttons: BorderButtonProps[]): Promise<void>;
export function alert(message: string, theme: string, firstAddition?: string | BorderButtonProps[], secondAddition?: BorderButtonProps[]): Promise<void> {
	let buttons: BorderButtonProps[] = [{ label: 'OK', autoWidth: true }];
	let title: string | undefined;

	if (typeof firstAddition === 'string') {
		title = firstAddition;
		if (Array.isArray(secondAddition)) {
			buttons = secondAddition;
		}
	}
	else if (Array.isArray(firstAddition)) {
		buttons = firstAddition;
	}

	return new Promise<void>(resolve => {
		const mappedButtons = buttons.map(e => {
			const onClick = () => {
				if (e.onClick) {
					e.onClick();
				}
				resolve();
			};
			return { ...e, onClick };
		});

		const node = createOverlay(
			<Dialog title={title} buttons={mappedButtons} className={`theme-${theme}`}>{message}</Dialog>
		);

		if (buttons.length < 2) {
			remote.globalShortcut.register('Enter', () => {
				remote.globalShortcut.unregister('Enter');
				close(node);
				resolve();
			});
		}
	});
}
