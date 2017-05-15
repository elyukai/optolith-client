import classNames from 'classnames';
import * as React from 'react';

export interface AvatarProps {
	className?: string;
	hasWrapper?: boolean;
	img?: boolean;
	src?: string;
	onClick?(): void;
}

export function Avatar(props: AvatarProps) {
	const { hasWrapper, img, onClick, src = '' } = props;
	let { className } = props;

	className = classNames(!hasWrapper && className, {
		'avatar': true,
		'no-avatar': !hasWrapper && !src
	});

	return img ? (
		<img
			className={className}
			src={src}
			onClick={onClick}
			alt=""
			/>
	) : (
		<div
			className={className}
			style={{ backgroundImage: `url("${src}")` }}
			onClick={onClick}
			/>
	);
}
