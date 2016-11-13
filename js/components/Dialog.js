import BorderButton from './BorderButton';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { close } from '../utils/createOverlay';

class Dialog extends Component {

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

		var { buttons: btns = [], title, node, ...props } = this.props;

		props.className = classNames('modal-backdrop', props.className);

		var buttons = [];

		for (let i = 0; i < btns.length; i++) {
			const btnProps = btns[i];

			btnProps.onClick = this.clickButton.bind(null, btnProps.onClick);

			buttons.push(
				<BorderButton key={'popup-button-' + i} {...btnProps} />
			);
		}

		var contentStyle = buttons.length === 0 ? { paddingBottom: 26 } : {};

		return (
			<div {...props}>
				<div className="modal-container">
					<div className="modal-close" onClick={this.close}><div>&#xe900;</div></div>
					<div className="modal-header"><div className="modal-header-inner">{title}</div></div>
					<div className="modal-content">
						<div className="modal-content-inner" style={contentStyle}>
							{this.props.children}
						</div>
					</div>
					{
						buttons.length > 0 && (
							<div className="modal-footer">
								<div className="modal-footer-inner">
									{buttons}
								</div>
							</div>
						)
					}
				</div>
			</div>
		);
    }
}

export default Dialog;
