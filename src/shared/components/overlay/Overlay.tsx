/**
 * The main axis is the axis that crosses both trigger and overlay:
 *
 * ```
 *     |
 *     |
 *     |
 * [overlay]
 *     |
 * [trigger]
 *     |
 *     |
 *     |
 * ```
 *
 * The cross axis is orthogonal to the main axis.
 */

import { RefObject, useEffect, useRef, useState } from "react"
import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import "./Overlay.scss"

type Position = "top" | "bottom" | "left" | "right"

// Minimum offset from window border in pixel
const MIN_WINDOW_OFFSET = 10

type OverlayPosition = {
  top: number
  left: number
}

type AxisGetter = (
  triggerRect: ClientRect | DOMRect,
  overlayRect: ClientRect | DOMRect,
  margin: number
) => number

const getTitlebarHeight = () => {
  const rawStyleValue = getComputedStyle(document.body).getPropertyValue("--titlebar-height")
  const numericValue = /(?<number>\d+)/u.exec(rawStyleValue)?.groups?.["number"]
  return numericValue === undefined ? 0 : Number.parseInt(numericValue, 10)
}

const getTopGapMainAxis: AxisGetter = (triggerRect, overlayRect, margin) =>
  triggerRect.top - margin - overlayRect.height - MIN_WINDOW_OFFSET - getTitlebarHeight()

const getBottomGapMainAxis: AxisGetter = (triggerRect, overlayRect, margin) =>
  window.innerHeight
  - (triggerRect.top + triggerRect.height + margin + overlayRect.height + MIN_WINDOW_OFFSET)

const getLeftGapMainAxis: AxisGetter = (triggerRect, overlayRect, margin) =>
  triggerRect.left - margin - overlayRect.width - MIN_WINDOW_OFFSET

const getRightGapMainAxis: AxisGetter = (triggerRect, overlayRect, margin) =>
  window.innerWidth
  - (triggerRect.left + triggerRect.width + margin + overlayRect.width + MIN_WINDOW_OFFSET)

const getPositionIfNotEnoughFreeSpace = (
  triggerRect: ClientRect | DOMRect,
  overlayRect: ClientRect | DOMRect,
  margin: number,
  pos: Position,
): Position => {
  const switchPos = (
    ifBelowZero: AxisGetter,
    ifAtLeastZero: AxisGetter,
    ifBothMatch: Position,
    otherwise: Position,
  ) =>
    ifBelowZero(triggerRect, overlayRect, margin) < 0
    && ifAtLeastZero(triggerRect, overlayRect, margin) >= 0
    ? ifBothMatch
    : otherwise

  switch (pos) {
    case "top":    return switchPos(getTopGapMainAxis, getBottomGapMainAxis, "bottom", "top")
    case "bottom": return switchPos(getBottomGapMainAxis, getTopGapMainAxis, "top", "bottom")
    case "left":   return switchPos(getLeftGapMainAxis, getRightGapMainAxis, "right", "left")
    case "right":  return switchPos(getRightGapMainAxis, getLeftGapMainAxis, "left", "right")
    default:       return assertExhaustive(pos)
  }
}

const getCenteredOverlayPosition = (
  triggerRect: ClientRect | DOMRect,
  overlayRect: ClientRect | DOMRect,
  margin: number,
  pos: Position,
): OverlayPosition => {
  switch (pos) {
    case "top": return {
      left: triggerRect.left + triggerRect.width / 2 - overlayRect.width / 2,
      top: triggerRect.top - overlayRect.height - margin,
    }

    case "bottom": return {
      left: triggerRect.left + triggerRect.width / 2 - overlayRect.width / 2,
      top: triggerRect.top + triggerRect.height + margin,
    }

    case "left": return {
      left: triggerRect.left - overlayRect.width - margin,
      top: triggerRect.top + triggerRect.height / 2 - overlayRect.height / 2,
    }

    case "right": return {
      left: triggerRect.left + triggerRect.width + margin,
      top: triggerRect.top + triggerRect.height / 2 - overlayRect.height / 2,
    }

    default: return assertExhaustive(pos)
  }
}

const adjustCrossAxis = (
  overlayRect: ClientRect | DOMRect,
  pos: Position,
  centeredRect: OverlayPosition,
): OverlayPosition => {
    switch (pos) {
      case "top":
      case "bottom": {
        const { top, left } = centeredRect

        return {
          top,
          left: left < MIN_WINDOW_OFFSET
            ? MIN_WINDOW_OFFSET
            : left + overlayRect.width > window.innerWidth - MIN_WINDOW_OFFSET
            ? window.innerWidth - MIN_WINDOW_OFFSET - overlayRect.width
            : left,
        }
      }

      case "left":
      case "right": {
        const { top, left } = centeredRect

        return {
          top: top < MIN_WINDOW_OFFSET
            ? MIN_WINDOW_OFFSET
            : top + overlayRect.height > window.innerHeight - MIN_WINDOW_OFFSET
            ? window.innerHeight - MIN_WINDOW_OFFSET - overlayRect.height
            : top,
          left,
        }
      }

      default: return assertExhaustive(pos)
    }
  }

const getArrowPosition = (
  arrowSize: number,
  overlayCoords: ClientRect | DOMRect,
  position: Position,
  centered: OverlayPosition,
  adjusted: OverlayPosition,
): OverlayPosition => {
    switch (position) {
      case "top": return {
        left: overlayCoords.width * 0.5 - arrowSize * 0.5 - 1 - adjusted.left + centered.left,
        top: overlayCoords.height - (arrowSize * 0.5 + 1.5),
      }

      case "bottom": return {
        left: overlayCoords.width * 0.5 - arrowSize * 0.5 - 1 - adjusted.left + centered.left,
        top: -arrowSize * 0.5 - 0.5,
      }

      case "left": return {
        left: overlayCoords.width - (arrowSize * 0.5 + 1.5),
        top: overlayCoords.height * 0.5 - arrowSize * 0.5 - 1 - adjusted.top + centered.top,
      }

      case "right": return {
        left: -arrowSize * 0.5 - 0.5,
        top: overlayCoords.height * 0.5 - arrowSize * 0.5 - 1 - adjusted.top + centered.top,
      }

      default: return assertExhaustive(position)
    }
  }

const alignToElement = (
  arrowSize: number,
  ref: RefObject<HTMLDivElement>,
  trigger: Element,
  defPosition: Position,
  margin: number,
): {
  newPosition: Position
  newCoords: Partial<OverlayPosition>
  newArrowCoords: Partial<OverlayPosition>
} => {
  if (ref.current !== null) {
    const triggerRect = trigger.getBoundingClientRect()
    const overlayRect = ref.current.getBoundingClientRect()
    const pos = getPositionIfNotEnoughFreeSpace(triggerRect, overlayRect, margin, defPosition)
    const centeredRect = getCenteredOverlayPosition(triggerRect, overlayRect, margin, pos)
    const adjustedRect = adjustCrossAxis(overlayRect, pos, centeredRect)
    const arrowPos = getArrowPosition(arrowSize, overlayRect, pos, centeredRect, adjustedRect)

    return { newPosition: pos, newCoords: adjustedRect, newArrowCoords: arrowPos }
  }

  return { newPosition: defPosition, newCoords: {}, newArrowCoords: {} }
}

type Props = {
  className?: string
  margin?: number
  position?: Position
  small?: boolean
  trigger: Element
}

export const Overlay: FCC<Props> = props => {
  const {
    children,
    className,
    margin = 0,
    position: defPosition = "top",
    small,
    trigger,
  } = props

  const [ position, setPosition ] = useState<Position>(defPosition)
  const [ style, setStyle ] = useState<React.CSSProperties>({ visibility: "hidden" })
  const [ arrowStyle, setArrowStyle ] = useState<React.CSSProperties>({})
  const overlayRef = useRef<HTMLDivElement>(null)

  const arrow_size = small === true ? 6 : 12

  useEffect(
    () => {
      const { newPosition, newCoords, newArrowCoords } =
        alignToElement(arrow_size, overlayRef, trigger, defPosition, margin)

      setPosition(newPosition)
      setArrowStyle({ height: arrow_size, width: arrow_size, ...newArrowCoords })
      setStyle(newCoords)
    },
    [ setPosition, setStyle, defPosition, margin, trigger, setArrowStyle, arrow_size ]
  )

  return (
    <div
      style={style}
      className={classList("overlay", `overlay-${position}`, className)}
      ref={overlayRef}
      >
      {children}
      <div className="arrow" style={arrowStyle} />
    </div>
  )
}
