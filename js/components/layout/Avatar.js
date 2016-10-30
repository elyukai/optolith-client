import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Avatar extends Component {

	static defaultProps = {
		src: ''
	};

	static propTypes = {
		className: PropTypes.any,
		img: PropTypes.bool,
		src: PropTypes.string,
		onClick: PropTypes.func,
		wrapper: PropTypes.bool
	};

	render() {

		const className = classNames('avatar', this.props.className);
		const { src, img, onClick, wrapper } = this.props;

		if (img) {
			return (
				<div className={classNames('avatar-wrapper', !src && 'no-avatar')} onClick={onClick} className={className}>
					<img src={src} alt="" />
				</div>
			);
		}
		else if (wrapper) {
			return (
				<div className={classNames('avatar-wrapper', !src && 'no-avatar')} onClick={onClick}>
					{this.props.children}
					<div className={className} style={{ backgroundImage: `url(${src})` }}></div>
				</div>
			);
		}
		else if (src) {
			return (
				<div className={className} style={{ backgroundImage: `url(${src})` }}></div>
			);
		}
		else {
			return (
				<div className={className}>
					{this.props.children}
				</div>
			);
		}
	}
}

export default Avatar;
