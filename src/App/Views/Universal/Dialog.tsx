import * as classNames from "classnames";
import * as React from "react";
import { notNullStrUndef } from "../../../Data/List";
import { close } from "../../Utilities/createOverlay";
import { ButtonProps, DialogButtons } from "./DialogButtons";

export interface DialogProps {
  buttons?: ButtonProps[]
  className?: string
  id?: string
  node?: HTMLDivElement
  title?: string
}

export class Dialog extends React.Component<DialogProps, {}> {
  close = () => close (this.props.node as HTMLDivElement)

  clickButton = (f: () => void) => {
    if (typeof f === "function") {
      f ()
    }

    close (this.props.node as HTMLDivElement)
  }

  render () {
    const { buttons = [], className, title, node: _, ...other } = this.props
    const contentStyle = buttons.length === 0 ? { paddingBottom: 26 } : {}

    return (
      <div
        className={classNames ("modal modal-backdrop", className)}
        {...other}
        >
        <div className="modal-container">
          <div className="modal-close" onClick={this.close}><div>&#xE5CD</div></div>
          {notNullStrUndef (title)
            ? <div className="modal-header"><div className="modal-header-inner">{title}</div></div>
            : null}
          <div className="modal-content">
            <div className="modal-content-inner" style={contentStyle}>
              {this.props.children}
            </div>
          </div>
          <DialogButtons list={buttons} onClickDefault={this.clickButton} />
        </div>
      </div>
    )
  }
}
