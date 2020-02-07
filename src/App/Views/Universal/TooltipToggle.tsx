import * as React from "react"
import { List } from "../../../Data/List"
import { guardReplace, Just, orN } from "../../../Data/Maybe"
import { classListMaybe } from "../../Utilities/CSS"
import { Overlay } from "./Overlay"

interface Props {
  content: React.ReactNode
  margin?: number
  small?: boolean
  position?: "top" | "bottom" | "left" | "right"
  target: JSX.Element
}

export const TooltipToggle: React.FC<Props> = props => {
  const { content, margin, position = "top", small, target } = props

  const [ isOpen, setIsOpen ] = React.useState (false)

  const targetRef = React.useRef<Element> (null)

  const handleMouseOver =
    React.useCallback (
      () => setIsOpen (true),
      [ setIsOpen ]
    )

  const handleMouseOut =
    React.useCallback (
      () => setIsOpen (false),
      [ setIsOpen ]
    )

  return (
    <>
      {React.cloneElement (
        target,
        {
          ref: targetRef,
          onMouseOut: handleMouseOut,
          onMouseOver: handleMouseOver,
        }
      )}
      {isOpen && targetRef .current !== null
        ? (
          <Overlay
            className={classListMaybe (List (
              Just (`tooltip`),
              guardReplace (orN (small)) ("tooltip-small")
            ))}
            position={position}
            trigger={targetRef .current}
            margin={margin}
            small={small}
            >
            {content}
          </Overlay>
        )
        : null}
    </>
  )
}
