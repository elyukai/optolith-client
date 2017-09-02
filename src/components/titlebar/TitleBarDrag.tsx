import * as React from 'react';

interface Props {
	children?: React.ReactNode;
}

export function TitleBarDrag(props: Props) {
	return (
		<div className="titlebar-drag">
			{props.children}
		</div>
	);
}
