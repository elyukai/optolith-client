import classNames from 'classnames';
import createOverlay, { close } from '../utils/createOverlay';
import Overlay from './Overlay';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class Tooltip extends Component {

	static propTypes = {
		content: PropTypes.node,
		margin: PropTypes.number,
		position: PropTypes.string
	};

	static defaultProps = {
		position: 'top'
	};

	state = {
		isDisplayed: false
	};

	triggerRef;
	node;

	componentWillUnmount() {
		if (this.node) {
			close(this.node);			
		}
	}
	
	open = () => {
		const { content, margin, position } = this.props;
		this.node = createOverlay(<Overlay className="tooltip" position={position} trigger={this.triggerRef} margin={margin}>
			{content}
		</Overlay>);
	};
	close = () => {
		close(this.node);
		this.node = undefined;
	};

	render() {

		const { children } = this.props;

		const only = React.cloneElement(React.Children.only(children), {
			onMouseOver: this.open,
			onMouseOut: this.close,
			ref: (node) => {
				if (node !== null && node.nodeType !== 1) {
					this.triggerRef = ReactDOM.findDOMNode(node);
				}
				else {
					this.triggerRef = node;
				}
			}
		});

		return only;
	}
}
