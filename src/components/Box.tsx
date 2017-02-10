import * as React from 'react';
import classNames from 'classnames';

interface Props {
	children?: React.ReactNode;
	className?: string;
}

export default (props: Props) => {
	const { children, ...other } = props;
	let { className } = props;

	className = classNames( 'box', className );

	return (
		<div {...other} className={className}>
			{children}
		</div>
	);
};
