import * as React from 'react';

interface Props {
	children?: React.ReactNode;
}

export default function Options(props: Props) {
	const { children } = props;
	return (
		<div className="options">
			{children}
		</div>
	);
}
