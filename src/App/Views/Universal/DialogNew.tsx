import * as React from "react";
import { List, notNullStrUndef } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
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
    const contentStyle = buttons.length === 0 ? { paddingBottom: 26 } : {}

    return (
      <Portal
        {...other}
        className={classListMaybe (List (Just ("modal modal-backdrop"), Maybe (className)))}
        >
        <div className="modal-container">
          {noCloseButton !== true
            ? <div className="modal-close" onClick={close}><div>&#xE5CD;</div></div>
            : null}
          {notNullStrUndef (title)
            ? <div className="modal-header"><div className="modal-header-inner">{title}</div></div>
            : null}
          <div className="modal-content">
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
