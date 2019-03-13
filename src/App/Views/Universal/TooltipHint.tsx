import * as React from 'react';
import { TooltipToggle } from './TooltipToggle';

export interface TooltipHintProps {
	children?: React.ReactNode;
	hint: string;
}

export function TooltipHint(props: TooltipHintProps) {
	const { children, hint } = props;
	return (
		<TooltipToggle
			content={hint}
			small
			>
			{children}
		</TooltipToggle>
	);
}
