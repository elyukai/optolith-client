import * as React from "react";
import { List, notNullStrUndef } from "../../../Data/List";
import { guardReplace, Just, Maybe } from "../../../Data/Maybe";
import { abs, max } from "../../../Data/Num";
import { classListMaybe } from "../../Utilities/CSS";
import { ButtonProps, DialogButtons } from "./DialogButtons";
import { Portal, PortalWrappedOwnProps } from "./Portal";

export interface DialogProps extends PortalWrappedOwnProps {
  buttons?: ButtonProps[]
  className?: string
  id?: string
  noCloseButton?: boolean
  title?: string
  close (): void
  onClose? (): void
}

export class Dialog extends React.Component<DialogProps, {}> {
  clickButton = (f: () => void) => {
    if (typeof f === "function") {
      f ()
    }

    if (this.props.onClose) {
      this.props.onClose ()
    }

    this.props.close ()
  }

  render () {
    const { buttons = [], className, close, noCloseButton, title, ...other } = this.props
    const contentStyle: React.CSSProperties = buttons.length === 0 ? { paddingBottom: 26 } : {}

    const height_diff_base = 77;
    const height_diff_add = 33;
    const padding_base = 55;

    const button_count = buttons .length

    const more_button_space = max (0) (button_count - 1) * height_diff_add
    const height_diff = button_count > 2 ? height_diff_base - more_button_space : height_diff_base
    const height_diff_abs = abs (height_diff)
    const height_diff_sign = height_diff < 0 ? "+" : "-"
    contentStyle.paddingBottom = button_count > 2 ? padding_base + more_button_space : padding_base

    return (
      <Portal
        {...other}
        className={classListMaybe (List (Just ("modal modal-backdrop"), Maybe (className)))}
        >
        <div
          className={
            classListMaybe (List (
              Just ("modal-container"),
              guardReplace (button_count > 2) ("more-buttons")
            ))
          }
          >
          {noCloseButton !== true
            ? <div className="modal-close" onClick={close}><div>&#xE5CD;</div></div>
            : null}
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
          {buttons.length > 0
            ? <DialogButtons list={buttons} onClickDefault={this.clickButton} />
            : null}
        </div>
      </Portal>
    )
  }
}
