import * as React from 'react';

interface Props {
	children?: React.ReactNode;
}

export default function ListItemButtons(props: Props) {
	const { children } = props;
	return (
		<div className="btns">
			{children}
		</div>
	);
}
