import * as React from 'react';
import Avatar from './Avatar';
import classNames from 'classnames';

interface Props {
	className?: string;
	children?: React.ReactNode;
	img?: boolean;
	onClick?: (e: React.MouseEvent<any>) => void;
	src: string;
}

export default (props: Props) => {
	const { children, img, onClick, src } = props;
	let { className } = props;

	className = classNames(className, {
		'avatar-wrapper': true,
		'no-avatar': !src
	});

	return (
		<div className={className} onClick={onClick}>
			{children}
			<Avatar img={img} src={src} hasWrapper />
		</div>
	);
};
