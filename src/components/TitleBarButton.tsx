import * as classNames from 'classnames';
import * as React from 'react';

export interface TitleBarButtonProps {
	className?: string;
	icon: string;
	onClick(): void;
}

export function TitleBarButton(props: TitleBarButtonProps) {
	return (
		<div className={classNames('titlebar-btn', props.className)} onClick={props.onClick}>
			<span>{props.icon}</span>
		</div>
	);
}
