import classNames from 'classnames';
import * as React from 'react';
import IconButton from './IconButton';
import TextField from './TextField';

interface Props {
	autoFocus?: boolean;
	className?: string;
	text: string;
	cancel(): void;
	submit(text: string): void;
}

interface State {
	text: string;
}

export default class EditText extends React.Component<Props, State> {
	state = {
		text: this.props.text,
	};

	submit = () => this.props.submit(this.state.text);

	handleEnter = (event: InputKeyEvent) => {
		if (event.charCode === 13 && this.state.text) {
			this.submit();
		}
	}

	handleInput = (event: InputTextEvent) => this.setState({ text: event.target.value } as State);

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
