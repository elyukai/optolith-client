// import { TextareaAutosize } from 'react-textarea-autosize';
import * as classNames from 'classnames';
import * as React from 'react';

export interface TextFieldContentEditableProps {
	disabled?: boolean;
	singleLine?: boolean;
	value: string;
	onChange(value: string): void;
}

export class TextFieldContentEditable extends React.Component<TextFieldContentEditableProps> {
	element?: HTMLDivElement;

	handleChange = () => {
		if (this.element) {
			this.props.onChange(this.element.innerHTML);
		}
	}

	render() {
		const { disabled, singleLine, value } = this.props;
		return (
			<div
				className={classNames('textarea', singleLine && 'single-line')}
				contentEditable={!disabled}
				onInput={this.handleChange}
				ref={e => this.element = e}
				>
				{value}
			</div>
		);
	}
}
