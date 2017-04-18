import * as React from 'react';

interface Props {
	children?: React.ReactNode;
}

export default function ListItemValues(props: Props) {
	const { children } = props;
	return (
		<div className="values">
			{children}
		</div>
	);
}
