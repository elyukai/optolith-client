import * as React from 'react';

export interface TitleBarRightProps {
	children?: React.ReactNode;
}

export function TitleBarRight(props: TitleBarRightProps) {
	return (
		<div className="titlebar-right">
			{props.children}
		</div>
	);
}
