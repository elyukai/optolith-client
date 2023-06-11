import { FC, ReactNode, cloneElement, useCallback, useRef, useState } from "react"
import { classList } from "../../utils/classList.ts"
import { Overlay } from "../overlay/Overlay.tsx"
import "./TooltipToggle.scss"

type Props = {
  content: ReactNode
  margin?: number
  small?: boolean
  position?: "top" | "bottom" | "left" | "right"
  target: JSX.Element
}

export const TooltipToggle: FC<Props> = props => {
  const { content, margin, position = "top", small, target } = props

  const [ isOpen, setIsOpen ] = useState(false)

  const targetRef = useRef<Element>(null)

  const handleMouseOver =
    useCallback(
      () => setIsOpen(true),
      [ setIsOpen ]
    )

  const handleMouseOut =
    useCallback(
      () => setIsOpen(false),
      [ setIsOpen ]
    )

  return (
    <>
      {cloneElement(
        target,
        {
          ref: targetRef,
          onMouseOut: handleMouseOut,
          onMouseOver: handleMouseOver,
        }
      )}
      {isOpen && targetRef.current !== null
        ? (
          <Overlay
            className={classList("tooltip", { "tooltip-small": small })}
            position={position}
            trigger={targetRef.current}
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
