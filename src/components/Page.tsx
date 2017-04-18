import * as React from 'react';

interface Props {
	children?: React.ReactNode;
	id: string;
}

export default function Options(props: Props) {
	const { children, id } = props;
	return (
		<div className="page" id={id}>
			{children}
		</div>
	);
}
