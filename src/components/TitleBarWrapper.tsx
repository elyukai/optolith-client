import * as React from 'react';

export interface TitleBarWrapperProps {
	children?: React.ReactNode;
	empty?: boolean;
}

export function TitleBarWrapper(props: TitleBarWrapperProps) {
	if (props.empty) {
		return <div className="titlebar empty"></div>;
	}

	return (
		<div className="titlebar">
			<div className="titlebar-inner">
				{props.children}
			</div>
		</div>
	);
}
