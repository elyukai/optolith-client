import * as React from "react";
import { fnullStr, notNullStr, List } from "../../../Data/List";
import { fromMaybe, Maybe, Just } from "../../../Data/Maybe";
import { InputKeyEvent, InputTextEvent } from "../../Models/Hero/heroTypeHelpers";
import { IconButton } from "./IconButton";
import { TextField } from "./TextField";
import { classListMaybe } from "../../Utilities/CSS";

export interface EditTextProps {
  autoFocus?: boolean
  className?: string
  text: string | undefined
  cancel (): void
  submit (text: string): void
}

export interface EditTextState {
  text: string
}

export class EditText extends React.Component<EditTextProps, EditTextState> {
  state = {
    text: fromMaybe ("") (Maybe (this.props.text)),
  }

  submit = () => notNullStr (this.state.text) ? this.props.submit (this.state.text) : undefined

  handleEnter = (event: InputKeyEvent) => {
    if (event.charCode === 13 && notNullStr (this.state.text)) {
      this.submit ()
    }
  }

  handleInput = (event: InputTextEvent) => this.setState ({ text: event.target.value })

  render () {
    return (
      <div
        className={
          classListMaybe (List (
            Just ("confirm-edit"),
            Maybe (this.props.className)
          ))
        }>
        <TextField
          value={this.state.text}
          onChange={this.handleInput}
          onKeyDown={this.handleEnter}
          autoFocus={this.props.autoFocus}
          />
        <IconButton
          icon="&#xE90a;"
          onClick={this.submit}
          disabled={fnullStr (this.state.text)}
          />
        <IconButton
          icon="&#xE915;"
          onClick={this.props.cancel}
          />
      </div>
    )
  }
}
