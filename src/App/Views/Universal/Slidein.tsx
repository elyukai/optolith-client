import * as React from "react";
import { List } from "../../../Data/List";
import { Just, Maybe } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";
import { Portal } from "./Portal";

interface Props {
  children?: React.ReactNode
  className?: string
  isOpen: boolean
  close (): void
}

export const Slidein: React.FC<Props> = props => {
  const { children, className, close, isOpen } = props

  return (
    <Portal
      isOpen={isOpen}
      className={classListMaybe (List (Just ("slidein-backdrop"), Maybe (className)))}
      >
      <div className="slidein">
        <div className="slidein-close" onClick={close}><div>{"&#xE5CD;"}</div></div>
          <div className="slidein-content">
            {children}
          </div>
      </div>
    </Portal>
  )
}
