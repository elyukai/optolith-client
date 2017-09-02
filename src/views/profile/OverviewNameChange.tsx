import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { TextField } from '../../components/TextField';
import { InputKeyEvent, InputTextEvent } from '../../types/data.d';

interface Props {
	name: string;
	cancel(): void;
	change(name: string): void;
}

interface State {
	name: string;
}

export class OverviewNameChange extends React.Component<Props, State> {
	state = {
		name: this.props.name,
	};

	change = () => this.props.change(this.state.name);

	handleEnter = (event: InputKeyEvent) => {
		if (event.charCode === 13 && this.state.name !== '') {
			this.change();
		}
	}

	handleInput = (event: InputTextEvent) => this.setState({ name: event.target.value } as State);

	render() {
		return (
			<div className="change-name">
				<TextField
					value={this.state.name}
					onChange={this.handleInput}
					onKeyDown={this.handleEnter}
					autoFocus
					/>
				<IconButton
					icon="&#xE876;"
					onClick={this.change}
					disabled={this.state.name === ''}
					/>
				<IconButton
					icon="&#xE5CD;"
					onClick={this.props.cancel}
					/>
			</div>
		);
	}
}
