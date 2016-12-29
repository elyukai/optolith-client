import { Component, PropTypes } from 'react';
import * as React from 'react';
import Avatar from './Avatar';
import classNames from 'classnames';

interface Props {
	className?: string;
	img?: boolean;
	onClick?: (e: React.MouseEvent<any>) => void;
	src: string;
}

export default class AvatarWrapper extends Component<Props, any> {

	static propTypes = {
		className: PropTypes.any,
		img: PropTypes.bool,
		onClick: PropTypes.func,
		src: PropTypes.string
	};

	render() {

		const { children, className, img, onClick, src } = this.props;

		const allClassNames = classNames({
			'avatar-wrapper': true,
			'no-avatar': !src,
			[className]: className
		});

		return (
			<div className={allClassNames} onClick={onClick}>
				{children}
				<Avatar img={img} src={src} hasWrapper />
			</div>
		);
	}
}
