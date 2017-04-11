import classNames from 'classnames';
import * as React from 'react';
import { close } from '../utils/createOverlay';
import DialogButtons from './DialogButtons';

interface Props {
	buttons?: Array<{
		autoWidth?: boolean;
		disabled?: boolean;
		label: string;
		primary?: boolean;
		onClick?(): void;
	}>;
	className?: string;
	id?: string;
	node?: HTMLDivElement;
	title?: string;
}

export default class Dialog extends React.Component<Props, undefined> {
	close = () => close(this.props.node as HTMLDivElement);

	clickButton = (func: () => void) => {
		if (func) {
			func();
		}
		close(this.props.node as HTMLDivElement);
	}

	render() {
		const { buttons = [], className, title, ...other } = this.props;
		const contentStyle = buttons.length === 0 ? { paddingBottom: 26 } : {};
		delete other.node;

		return (
			<div
				className={classNames('modal modal-backdrop', className)}
				{...other}
				>
				<div className="modal-container">
					<div className="modal-close" onClick={this.close}><div>&#xE5CD;</div></div>
					{title ? <div className="modal-header"><div className="modal-header-inner">{title}</div></div> : null}
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
