import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class SheetHeader extends Component {

	static propTypes = {
		id: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		value: PropTypes.number.isRequired,
	};

	render() {

		const { id, label, value } = this.props;

		const className = classNames('sheet-attribute', id);

		return (
			<div className={className}>
				<span className="label">{label}</span>
				<span className="value">{value}</span>
			</div>
		);
	}
}
