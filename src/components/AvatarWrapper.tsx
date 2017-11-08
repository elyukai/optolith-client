import * as classNames from 'classnames';
import { existsSync } from 'fs';
import * as React from 'react';
import { isBase64Image } from '../utils/RegexUtils';
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
	const validPath = typeof src === 'string' && src.length > 0 && (isBase64Image(src) || existsSync(src.replace(/file:[\\\/]+/, '')));

	className = classNames(className, {
		'avatar-wrapper': true,
		'no-avatar': !validPath
	});

	return (
		<div className={className} onClick={onClick}>
			{children}
			<Avatar img={img} src={src} hasWrapper validPath={validPath} />
		</div>
	);
}
