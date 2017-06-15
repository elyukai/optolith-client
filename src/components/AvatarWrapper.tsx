import * as classNames from 'classnames';
import * as React from 'react';
import { Avatar } from './Avatar';

export interface AvatarWrapperProps {
	className?: string;
	children?: React.ReactNode;
	img?: boolean;
	src?: string;
	onClick?(): void;
}

export function AvatarWrapper(props: AvatarWrapperProps) {
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
}
