import { close } from '../utils/createOverlay';
import { Component, PropTypes } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import DialogButtons from './DialogButtons';

interface Props {
	buttons?: any[];
	className?: string;
	id?: string;
	node?: HTMLDivElement;
	title?: string;
}

export default class Dialog extends Component<Props, any> {

	static propTypes = {
		buttons: PropTypes.array,
		className: PropTypes.any,
		id: PropTypes.string,
		node: PropTypes.any,
		title: PropTypes.any
	};

	close = () => close(this.props.node);

	clickButton = (func) => {
		if (func) {
			func();
		}
		close(this.props.node);
	}

	render() {

		const { buttons = [], title, ...other } = this.props;

		other.className = classNames('modal modal-backdrop', other.className);
		delete other.node;

		const contentStyle = buttons.length === 0 ? { paddingBottom: 26 } : {};

		return (
			<div {...other}>
				<div className="modal-container">
					<div className="modal-close" onClick={this.close}><div>&#xe900;</div></div>
					{title?<div className="modal-header"><div className="modal-header-inner">{title}</div></div>:null}
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
