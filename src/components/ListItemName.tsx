import classNames from 'classnames';
import * as React from 'react';

export interface ListItemNameProps {
	addName?: string;
	children?: React.ReactNode;
	large?: boolean | JSX.Element;
	name: string;
}

export function ListItemName(props: ListItemNameProps) {
	const { addName, children, large, name } = props;
	const addNameElement = addName && <span className="add">{addName}</span>;
	const nameElement = addName ? <span>{name}</span> : name;
	return (
		<div className={classNames('name', large && 'large')}>
			<p className="title">{nameElement}{addNameElement}</p>
			{children}
		</div>
	);
}
