import Overlay from './Overlay';
import React, { Component, PropTypes } from 'react';

export default class Tooltip extends Component {

	static propTypes = {
		content: PropTypes.node
	};

	triggerRef;

	componentDidMount() {
		this.triggerRef = this.refs.trigger;
	}

	render() {

		const { children, content } = this.props;

		return (
			<div className="tooltip-wrapper" ref="trigger">
				{content}
				<Overlay className="tooltip" trigger={this.triggerRef}>
					{children}
				</Overlay>
			</div>
		);
	}
}
