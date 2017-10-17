import * as classNames from 'classnames';
import * as React from 'react';
import { ButtonProps, DialogButtons } from './DialogButtons';
import { Portal, PortalWrappedOwnProps } from './Portal';

export interface DialogProps extends PortalWrappedOwnProps {
	buttons?: ButtonProps[];
	className?: string;
	id?: string;
	title?: string;
	close(): void;
	onClose?(): void;
}

export class Dialog extends React.Component<DialogProps, {}> {
	clickButton = (func: () => void) => {
		if (func) {
			func();
		}
		if (this.props.onClose) {
			this.props.onClose();
		}
		this.props.close();
	}

	render() {
		const { buttons = [], className, close, title, ...other } = this.props;
		const contentStyle = buttons.length === 0 ? { paddingBottom: 26 } : {};

		return (
			<Portal
				{...other}
				className={classNames('modal modal-backdrop', className)}
				>
				<div className="modal-container">
					<div className="modal-close" onClick={close}><div>&#xE5CD;</div></div>
					{title ? <div className="modal-header"><div className="modal-header-inner">{title}</div></div> : null}
					<div className="modal-content">
						<div className="modal-content-inner" style={contentStyle}>
							{this.props.children}
						</div>
					</div>
					<DialogButtons list={buttons} onClickDefault={this.clickButton} />
				</div>
			</Portal>
		);
	}
}
