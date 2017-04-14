import classNames from 'classnames';
import * as React from 'react';

interface Props {
	className?: string;
	[id: string]: any;
}

export default function Icon(props: Props){
	const { className, ...other } = props;

	return (
		<div className={classNames('icon', className)} {...other} />
	);
}
