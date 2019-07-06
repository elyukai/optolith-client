import * as React from "react";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";
import { Portal } from "./Portal";

export interface SlideinProps {
  children?: React.ReactNode
  className?: string
  isOpen: boolean
  close (): void
}

export function Slidein (props: SlideinProps) {
  const { children, className, close, ...other } = props

  return (
    <Portal
      {...other}
      className={classListMaybe (List (Just ("slidein-backdrop"), Maybe (className)))}
      >
      <div className="slidein">
        <div className="slidein-close" onClick={close}><div>&#xE5CD;</div></div>
          <div className="slidein-content">
            {children}
          </div>
      </div>
    </Portal>
  )
}
