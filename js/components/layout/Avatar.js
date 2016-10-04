import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Avatar extends Component {

	static defaultProps = {
		src: ''
	};

	static propTypes = {
		className: PropTypes.any,
		src: PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	render() {

		const className = classNames('avatar', this.props.className);

		if (this.props.src) {
			return (
				<div className={className} style={{ backgroundImage: `url(${this.props.src})` }}></div>
			);
		} else {
			return (
				<div className={className}>
					{this.props.children}
				</div>
			);
		}
	}
}

export default Avatar;
