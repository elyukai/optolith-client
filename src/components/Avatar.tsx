import * as classNames from 'classnames';
import { existsSync } from 'fs';
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
	const validPath = src.length > 0 && existsSync(src.replace(/file:[\\\/]+/, ''));

	className = classNames(!hasWrapper && className, {
		'avatar': true,
		'no-avatar': !hasWrapper && !validPath
	});

	return img ? (
		<img
			className={className}
			src={validPath ? src : ''}
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
