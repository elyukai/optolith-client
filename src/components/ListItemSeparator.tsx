import * as React from 'react';

interface Props {
	children?: React.ReactNode;
}

export default function ListItemSeparator(props: Props) {
	const { children } = props;
	return (
		<div className="hr"></div>
	);
}
