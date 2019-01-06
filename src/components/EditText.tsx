import * as classNames from 'classnames';
import * as React from 'react';
import { InputKeyEvent, InputTextEvent } from '../App/Models/Hero/heroTypeHelpers';
import { IconButton } from './IconButton';
import { TextField } from './TextField';

export interface EditTextProps {
  autoFocus?: boolean;
  className?: string;
  text: string | undefined;
  cancel(): void;
  submit(text: string): void;
}

export interface EditTextState {
  text: string;
}

export class EditText extends React.Component<EditTextProps, EditTextState> {
  state = {
    text: this.props.text || '',
  };

  submit = () => this.state.text && this.props.submit(this.state.text);

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
          icon="&#xE90a;"
          onClick={this.submit}
          disabled={!this.state.text}
          />
        <IconButton
          icon="&#xE915;"
          onClick={this.props.cancel}
          />
      </div>
    );
  }
}
