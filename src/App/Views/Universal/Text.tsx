import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"
import { ChildrenProps } from "../../Utilities/ReactUtils"

export interface TextProps extends ChildrenProps {
  className?: string
  onMouseOut?: () => void
  onMouseOver?: () => void
  onMouseDown?: () => void
}

const Text: React.RefForwardingComponent<HTMLDivElement, TextProps> = (props, ref) => {
  const { children, className, onMouseOut, onMouseOver, onMouseDown } = props

  return (
    <div
      ref={ref}
      className={classListMaybe (List (Just ("text"), Maybe (className)))}
      onMouseOut={onMouseOut}
      onMouseOver={onMouseOver}
      onMouseDown={onMouseDown}
      >
      {children}
    </div>
  )
}

const TextRef = React.forwardRef (Text)

export { TextRef as Text }
