import * as React from 'react';
import classNames from 'classnames';

interface Props {
	className?: string;
	hasWrapper?: boolean;
	img?: boolean;
	src: string;
	onClick?(): void;
}

export default (props: Props) => {
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
};
