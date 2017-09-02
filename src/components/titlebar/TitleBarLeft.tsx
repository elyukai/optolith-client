import * as React from 'react';

export interface TitleBarLeftProps {
	children?: React.ReactNode;
}

export function TitleBarLeft(props: TitleBarLeftProps) {
	return (
		<div className="titlebar-left">
			{props.children}
		</div>
	);
}
