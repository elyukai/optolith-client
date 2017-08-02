import * as React from 'react';

export interface TitleBarWrapperProps {
	children?: React.ReactNode;
}

export function TitleBarWrapper(props: TitleBarWrapperProps) {
	return (
		<div className="navbar">
			<div className="navbar-inner">
				{props.children}
			</div>
		</div>
	);
}
