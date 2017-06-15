import * as classNames from 'classnames';
import * as React from 'react';
import { InputKeyEvent, InputTextEvent } from '../types/data.d';
import { IconButton } from './IconButton';
import { TextField } from './TextField';

export interface EditTextProps {
	autoFocus?: boolean;
	className?: string;
	text: string;
	cancel(): void;
	submit(text: string): void;
}

interface EditTextState {
	text: string;
}

export class EditText extends React.Component<EditTextProps, EditTextState> {
	state = {
		text: this.props.text,
	};

	submit = () => this.props.submit(this.state.text);

	handleEnter = (event: InputKeyEvent) => {
		if (event.charCode === 13 && this.state.text) {
			this.submit();
		}
	}

	handleInput = (event: InputTextEvent) => this.setState({ text: event.target.value } as EditTextState);

	render() {
		return (
			<div className={classNames('confirm-edit', this.props.className)}>
				<TextField
					value={this.state.text}
					onChange={this.handleInput}
					onKeyDown={this.handleEnter}
					autoFocus={this.props.autoFocus}
					/>
				<IconButton
					icon="&#xE876;"
					onClick={this.submit}
					disabled={!this.state.text}
					/>
				<IconButton
					icon="&#xE5CD;"
					onClick={this.props.cancel}
					/>
			</div>
		);
	}
}
