import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class AttributeBorder extends Component {

	static propTypes = {
		className: PropTypes.string,
		label: PropTypes.string.isRequired,
		value: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		])
	};

	render() {

		const className = classNames( 'attr', this.props.className );

		return (
			<div className={className}>
				<div className="short">{this.props.label}</div>
				<div className="value"><div><div>{this.props.value}</div></div></div>
				{this.props.children}
			</div>
		);
	}
}

export default AttributeBorder;
