import * as classNames from 'classnames';
import { existsSync } from 'fs';
import * as React from 'react';
import { isBase64Image } from '../utils/RegexUtils';

export interface AvatarProps {
	className?: string;
	hasWrapper?: boolean;
	img?: boolean;
	src?: string;
	validPath?: boolean;
	onClick?(): void;
}

export function Avatar(props: AvatarProps) {
	const { hasWrapper, img, onClick, src = '' } = props;
	const { validPath = src.length > 0 && (isBase64Image(src) || existsSync(src.replace(/file:[\\\/]+/, ''))) } = props;
	let { className } = props;

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
			style={validPath ? { backgroundImage: `url("${src}")` } : undefined}
			onClick={onClick}
			/>
	);
}
