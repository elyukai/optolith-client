import * as classNames from "classnames";
import * as React from "react";
import { Portal } from "./Portal";

export interface SlideinProps {
  children?: React.ReactNode
  className?: string
  isOpened: boolean
  close (): void
}

export function Slidein (props: SlideinProps) {
  const { children, className, close, ...other } = props

  return (
    <Portal {...other} className={classNames ("slidein-backdrop", className)}>
      <div className="slidein">
        <div className="slidein-close" onClick={close}><div>&#xE5CD</div></div>
          <div className="slidein-content">
            {children}
          </div>
      </div>
    </Portal>
  )
}
