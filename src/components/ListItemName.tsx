import classNames from 'classnames';
import * as React from 'react';

interface Props {
	children?: React.ReactNode;
	main: string;
}

export default function ListItemName(props: Props) {
	const { children, main } = props;
	return (
		<div className="name">
			<p className="title">{main}</p>
			{children}
		</div>
	);
}
