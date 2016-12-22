import classNames from 'classnames';
import createOverlay, { close } from '../utils/createOverlay';
import Overlay from './Overlay';
import React, { Component, PropTypes } from 'react';

export default class Tooltip extends Component {

	static propTypes = {
		content: PropTypes.node,
		margin: PropTypes.number
	};

	state = {
		isDisplayed: false
	};

	triggerRef;
	node;

	componentDidMount() {
		this.triggerRef = this.refs.trigger;
	}

	open = () => {
		const { content, margin } = this.props;
		this.node = createOverlay(<Overlay className="tooltip" position="top" trigger={this.triggerRef} margin={margin}>
			{content}
		</Overlay>);
	};
	close = () => close(this.node);

	render() {

		const { children } = this.props;

		const only = React.cloneElement(React.Children.only(children), {
			onMouseEnter: this.open,
			onMouseLeave: this.close,
			ref: 'trigger'
		});

		return only;
	}
}
