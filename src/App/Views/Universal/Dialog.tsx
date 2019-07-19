import * as React from "react";
import { List, notNullStrUndef } from "../../../Data/List";
import { guardReplace, Just, Maybe } from "../../../Data/Maybe";
import { close } from "../../Utilities/createOverlay";
import { classListMaybe } from "../../Utilities/CSS";
import { abs, max } from "../../Utilities/mathUtils";
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

    const height_diff_base = 77;
    const height_diff_add = 33;

    const height_diff = height_diff_base - max (0) (buttons .length - 2) * height_diff_add
    const height_diff_abs = abs (height_diff)
    const height_diff_sign = height_diff < 0 ? "+" : "-"

    return (
      <div
        className={classListMaybe (List (Just ("modal modal-backdrop"), Maybe (className)))}
        {...other}
        >
        <div
          className={
            classListMaybe (List (
              Just ("modal-container"),
              guardReplace (buttons .length > 2) ("more-buttons")
            ))
          }
          >
          <div className="modal-close" onClick={this.close}><div>&#xE5CD;</div></div>
          {notNullStrUndef (title)
            ? <div className="modal-header"><div className="modal-header-inner">{title}</div></div>
            : null}
          <div
            className="modal-content"
            style={{ height: `calc(100% ${height_diff_sign} ${height_diff_abs}px)` }}
            >
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
