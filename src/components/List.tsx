import * as React from 'react';

interface Props {
	children?: React.ReactNode;
}

export default function List(props: Props) {
	const { children } = props;
	return (
		<ul className="list-wrapper">
			{children}
		</ul>
	);
}
