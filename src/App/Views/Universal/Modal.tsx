import * as React from "react";
import { Portal } from "react-portal";
import { notNullStrUndef } from "../../../Data/List";

interface CallBackProps extends React.Props<any> {
  closePortal (): void
}

interface ReactPortalProps {
  isOpened?: boolean
  openByClickOn?: React.ReactElement<CallBackProps>
  closeOnEsc?: boolean
  closeOnOutsideClick?: boolean
  onOpen? (node: HTMLDivElement): {}
  beforeClose? (node: HTMLDivElement, resetPortalState: () => void): {}
  onClose? (): {}
  onUpdate? (): {}
}

export interface ModalProps extends ReactPortalProps {
  children?: React.ReactNode
  title?: string
}

export function Modal (props: ModalProps) {
  const { children, title, ...portalProps } = props

  return (
    <Portal {...portalProps}>
      <div className="modal">
        {notNullStrUndef (title) ? <h1 className="title">{title}</h1> : null}
        {children}
      </div>
      <div className="modal-background"></div>
    </Portal>
  )
}
