import DialogButtons from './DialogButtons';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { close } from '../utils/createOverlay';

export default class Dialog extends Component {

	static propTypes = {
		buttons: PropTypes.array,
		className: PropTypes.any,
		id: PropTypes.string,
		node: PropTypes.any,
		title: PropTypes.any
	}

	close = () => close(this.props.node);

	clickButton = (func) => {
		if (func) func();
		this.close(this.props.node);
	};

    render() {

		var { buttons = [], title, ...other } = this.props;

		other.className = classNames('modal-backdrop', other.className);
		delete other.node;

		var contentStyle = buttons.length === 0 ? { paddingBottom: 26 } : {};

		return (
			<div {...other}>
				<div className="modal-container">
					<div className="modal-close" onClick={this.close}><div>&#xe900;</div></div>
					<div className="modal-header"><div className="modal-header-inner">{title}</div></div>
					<div className="modal-content">
						<div className="modal-content-inner" style={contentStyle}>
							{this.props.children}
						</div>
					</div>
					<DialogButtons list={buttons} onClickDefault={this.clickButton} />
				</div>
			</div>
		);
    }
}
