import * as React from 'react';

interface Props {
	children?: React.ReactNode;
}

export default function ListItemSelections(props: Props) {
	const { children } = props;
	return (
		<div className="selections">
			{children}
		</div>
	);
}
