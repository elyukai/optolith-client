import Box from './Box';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class LabelBox extends Component {

	static propTypes = {
		className: PropTypes.string,
		label: PropTypes.string.isRequired,
		value: PropTypes.any
	};

	constructor(props) {
		super(props);
	}

	render() {

		const { children, label, value } = this.props;

		const className = classNames( 'labelbox', this.props.className );

		return (
			<div className={className}>
				<Box>{value ? value : children}</Box>
				<label>{label}</label>
			</div>
		);
	}
}

export default LabelBox;
