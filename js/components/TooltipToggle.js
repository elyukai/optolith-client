import classNames from 'classnames';
import Overlay from './Overlay';
import React, { Component, PropTypes } from 'react';

export default class Tooltip extends Component {

	static propTypes = {
		content: PropTypes.node,
		margin: PropTypes.number
	};

	state = {
		isDisplayed: false,
	};

	triggerRef;

	componentDidMount() {
		this.triggerRef = this.refs.trigger;
	}

	open = () => this.setState({ isDisplayed: true });
	close = () => this.setState({ isDisplayed: false });

	render() {

		const { children, content, margin, ...other } = this.props;
		const { isDisplayed } = this.state;

		other.className = classNames('tooltip-wrapper', other.className);

		return (
			<div {...other} ref="trigger" onMouseEnter={this.open} onMouseLeave={this.close}>
				{ isDisplayed ? <Overlay className="tooltip" position="top" trigger={this.triggerRef} margin={margin}>
					{content}
				</Overlay> : null }
				{children}
			</div>
		);
	}
}
