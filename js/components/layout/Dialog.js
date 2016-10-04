import BorderButton from './BorderButton';
import GeminiScrollbar from 'react-gemini-scrollbar';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

class Dialog extends Component {

	static propTypes = {
		buttons: PropTypes.array,
		className: PropTypes.any,
		id: PropTypes.string,
		title: PropTypes.any
	}

	constructor(props) {
		super(props);
	}

	close = () => {
		ReactDOM.unmountComponentAtNode(this.props.node);
		document.body.removeChild(this.props.node);
	};

	clickButton = (func) => {
		if (func) func();
		this.close(this.props.node);
	};

    render() {

		const props = {
			className: classNames('modal-backdrop', this.props.className)
		};

		if (this.props.id) props.id = this.props.id;

		var buttons = [];

		if (this.props.buttons) {
			for (let i = 0; i < this.props.buttons.length; i++) {
				const btnProps = this.props.buttons[i];

				btnProps.onClick = this.clickButton.bind(null, btnProps.onClick);

				buttons.push(
					<BorderButton key={'popup-button-' + i} {...btnProps} />
				);
			}
		}

		return (
			<div {...props}>
				<div className="modal-container">
					<div className="modal-close" onClick={this.close}><div>&#xe900;</div></div>
					<div className="modal-header"><div className="modal-header-inner">{this.props.title}</div></div>
					<div className="modal-content">
						<div className="modal-content-inner">
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
