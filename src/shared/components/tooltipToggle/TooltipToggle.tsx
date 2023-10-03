import { FC, ReactNode, RefObject, useEffect, useState } from "react"
import { classList } from "../../utils/classList.ts"
import { Overlay } from "../overlay/Overlay.tsx"
import "./TooltipToggle.scss"

type Props = {
  content: ReactNode
  margin?: number
  small?: boolean
  position?: "top" | "bottom" | "left" | "right"
  targetRef: RefObject<HTMLElement>
}

/**
 * Displays a tooltip on hover.
 */
export const TooltipToggle: FC<Props> = props => {
  const { content, margin, position = "top", small, targetRef } = props

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const onMouseOver = () => setIsOpen(true)
    const onMouseOut = () => setIsOpen(false)

    const target = targetRef.current

    target?.addEventListener("mouseover", onMouseOver)
    target?.addEventListener("mouseout", onMouseOut)

    return () => {
      target?.removeEventListener("mouseover", onMouseOver)
      target?.removeEventListener("mouseout", onMouseOut)
    }
  }, [targetRef])

  return isOpen && targetRef.current !== null ? (
    <Overlay
      className={classList("tooltip", { "tooltip-small": small })}
      position={position}
      trigger={targetRef.current}
      margin={margin}
      small={small}
    >
      {content}
    </Overlay>
  ) : null
}
