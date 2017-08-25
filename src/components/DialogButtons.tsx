import * as React from 'react';
import { BorderButton, BorderButtonProps } from './BorderButton';

export { BorderButtonProps as ButtonProps };

export interface DialogButtonsProps {
	list: BorderButtonProps[];
	onClickDefault?(func?: () => void): void;
}

export function DialogButtons(props: DialogButtonsProps) {
	const { list, onClickDefault } = props;

	const buttons = Array.isArray(list) && list.length > 0 ? list.map(e => {
		return <BorderButton {...e} onClick={onClickDefault ? onClickDefault.bind(null, e.onClick) : e.onClick} key={e.label} />;
	}) : [];

	return (
		<div className="dialog-buttons">
			<div className="dialog-buttons-inner">
				{buttons}
			</div>
		</div>
	);
}
