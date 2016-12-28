import Avatar from './Avatar';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class AvatarWrapper extends Component {

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
