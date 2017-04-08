import * as React from 'react';

interface Props {
	children?: React.ReactNode;
}

export default function TitleBarDrag(props: Props) {
	return (
		<div className="titlebar-drag">
			{props.children}
		</div>
	);
}
