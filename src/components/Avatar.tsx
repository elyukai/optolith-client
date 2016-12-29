import { Component, PropTypes } from 'react';
import * as React from 'react';
import classNames from 'classnames';

interface Props {
	className?: string;
	hasWrapper?: boolean;
	img?: boolean;
	onClick?: (e: React.MouseEvent<any>) => void;
	src: string;
}

export default class Avatar extends Component<Props, any> {

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
