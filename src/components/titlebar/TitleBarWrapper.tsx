import * as React from 'react';

export interface TitleBarWrapperProps {
	children?: React.ReactNode;
}

export function TitleBarWrapper(props: TitleBarWrapperProps) {
	return (
		<div className="titlebar">
			<div className="titlebar-inner">
				{props.children}
			</div>
		</div>
	);
}
