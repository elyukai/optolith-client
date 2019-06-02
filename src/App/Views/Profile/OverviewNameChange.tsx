import * as React from "react";
import { InputKeyEvent, InputTextEvent } from "../../Models/Hero/heroTypeHelpers";
import { IconButton } from "../Universal/IconButton";
import { TextField } from "../Universal/TextField";

interface Props {
  name: string
  cancel (): void
  change (name: string): void
}

interface State {
  name: string
}

export class OverviewNameChange extends React.Component<Props, State> {
  state = {
    name: this.props.name,
  }

  change = () => this.props.change (this.state.name)

  handleEnter = (event: InputKeyEvent) => {
    if (event.charCode === 13 && this.state.name !== "") {
      this.change ()
    }
  }

  handleInput = (event: InputTextEvent) => this.setState (() => ({ name: event.target.value }))

  render () {
    return (
      <div className="change-name">
        <TextField
          value={this.state.name}
          onChange={this.handleInput}
          onKeyDown={this.handleEnter}
          autoFocus
          />
        <IconButton
          icon="&#xE90a;"
          onClick={this.change}
          disabled={this.state.name === ""}
          />
        <IconButton
          icon="&#xE915;"
          onClick={this.props.cancel}
          />
      </div>
    )
  }
}
