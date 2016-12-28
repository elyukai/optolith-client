import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Avatar extends Component {

	static propTypes = {
		className: PropTypes.any,
		hasWrapper: PropTypes.bool,
		img: PropTypes.bool,
		onClick: PropTypes.func,
		src: PropTypes.string
	};

	static defaultProps = {
		src: ''
	};

	render() {

		const { className, hasWrapper, img, onClick, src } = this.props;

		const allClassNames = classNames({
			'avatar': true,
			'no-avatar': !hasWrapper && !src,
			[className]: !hasWrapper && className
		});
		
		return img ? (
			<img
				className={allClassNames}
				src={src}
				onClick={onClick}
				alt=""
				/>
		) : (
			<div
				className={allClassNames}
				style={{ backgroundImage: `url(${src})` }}
				onClick={onClick}
				/>
		);
	}
}
