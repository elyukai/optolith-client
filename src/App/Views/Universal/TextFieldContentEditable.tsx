// import { TextareaAutosize } from 'react-textarea-autosize'
import * as React from "react";
import { orN, Just, guardReplace } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";
import { List } from "../../../Data/List";

export interface TextFieldContentEditableProps {
  disabled?: boolean
  singleLine?: boolean
  value: string
  onChange (value: string): void
}

export class TextFieldContentEditable extends React.Component<TextFieldContentEditableProps> {
  element: HTMLDivElement | null = null

  handleChange = () => {
    if (this.element !== null) {
      this.props.onChange (this.element.innerHTML)
    }
  }

  render () {
    const { disabled, singleLine, value } = this.props

    return (
      <div
        className={
          classListMaybe (List (
            Just ("textarea"),
            guardReplace (orN (singleLine)) ("single-line")
          ))
        }
        contentEditable={disabled !== true}
        onInput={this.handleChange}
        ref={e => this.element = e}
        >
        {value}
      </div>
    )
  }
}
