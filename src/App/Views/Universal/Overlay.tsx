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

import * as React from "react"
import { ident } from "../../../Data/Function"
import { over } from "../../../Data/Lens"
import { List } from "../../../Data/List"
import { Just, Maybe } from "../../../Data/Maybe"
import { fromDefault, makeLenses, Record, toObject } from "../../../Data/Record"
import { classListMaybe } from "../../Utilities/CSS"

type Position = "top" | "bottom" | "left" | "right"

// Minimum offset from window border in pixel
const MIN_WINDOW_OFFSET = 10

interface OverlayPosition {
  "@@name": "OverlayPosition"
  top: number
  left: number
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const OverlayPosition = fromDefault ("OverlayPosition") <OverlayPosition> ({ top: 0, left: 0 })

const OPA = OverlayPosition.A
const OPL = makeLenses (OverlayPosition)

const getTopGapMainAxis: (triggerCoord: ClientRect | DOMRect) =>
                         (overlayCoord: ClientRect | DOMRect) =>
                         (margin: number) => number =
  trg => ovl => m => trg .top - m - ovl .height - MIN_WINDOW_OFFSET

const getBottomGapMainAxis: (triggerCoord: ClientRect | DOMRect) =>
                            (overlayCoord: ClientRect | DOMRect) =>
                            (margin: number) => number =
  trg => ovl => m => window .innerHeight
                     - (trg .top + trg .height + m + ovl .height + MIN_WINDOW_OFFSET)

const getLeftGapMainAxis: (triggerCoord: ClientRect | DOMRect) =>
                          (overlayCoord: ClientRect | DOMRect) =>
                          (margin: number) => number =
  trg => ovl => m => trg .left - m - ovl .width - MIN_WINDOW_OFFSET

const getRightGapMainAxis: (triggerCoord: ClientRect | DOMRect) =>
                           (overlayCoord: ClientRect | DOMRect) =>
                           (margin: number) => number =
  trg => ovl => m => window .innerWidth
                     - (trg .left + trg .width + m + ovl .width + MIN_WINDOW_OFFSET)

const getPositionIfNotEnoughFreeSpace: (triggerCoord: ClientRect | DOMRect) =>
                                       (overlayCoord: ClientRect | DOMRect) =>
                                       (margin: number) =>
                                       (defPosition: Position) => Position =
  trg => ovl => m => pos => {
    switch (pos) {
      case "top":
        return getTopGapMainAxis (trg) (ovl) (m) < 0 && getBottomGapMainAxis (trg) (ovl) (m) >= 0
          ? "bottom"
          : "top"

      case "bottom":
        return getBottomGapMainAxis (trg) (ovl) (m) < 0 && getTopGapMainAxis (trg) (ovl) (m) >= 0
          ? "top"
          : "bottom"

      case "left":
        return getLeftGapMainAxis (trg) (ovl) (m) < 0 && getRightGapMainAxis (trg) (ovl) (m) >= 0
          ? "right"
          : "left"

      case "right":
        return getRightGapMainAxis (trg) (ovl) (m) < 0 && getLeftGapMainAxis (trg) (ovl) (m) >= 0
          ? "left"
          : "right"

      default:
        return pos
    }
  }

const getCenteredOverlayPosition: (triggerCoord: ClientRect | DOMRect) =>
                                  (overlayCoord: ClientRect | DOMRect) =>
                                  (margin: number) =>
                                  (position: Position) => Record<OverlayPosition> =
  trg => ovl => m => pos => {
    switch (pos) {
      case "top":
        return OverlayPosition ({
          left: trg .left + trg .width / 2 - ovl .width / 2,
          top: trg .top - m - ovl .height,
        })

      case "bottom":
        return OverlayPosition ({
          left: trg .left + trg .width / 2 - ovl .width / 2,
          top: trg .top + trg .height + m,
        })

      case "left":
        return OverlayPosition ({
          left: trg .left - m - ovl .width,
          top: trg .top + trg .height / 2 - ovl .height / 2,
        })

      case "right":
        return OverlayPosition ({
          left: trg .left + trg .width + m,
          top: trg .top + trg .height / 2 - ovl .height / 2,
        })

      default:
        return OverlayPosition.default
    }
  }

const adjustCrossAxis: (overlayCoord: ClientRect | DOMRect) =>
                       (position: Position) =>
                       (centeredCoord: Record<OverlayPosition>) => Record<OverlayPosition> =
  ovl => pos => {
    switch (pos) {
      case "top":
      case "bottom":
        return over (OPL.left)
                    (left => left < MIN_WINDOW_OFFSET
                             ? MIN_WINDOW_OFFSET
                             : left + ovl .width > window .innerWidth - MIN_WINDOW_OFFSET
                             ? window .innerWidth - MIN_WINDOW_OFFSET - ovl .width
                             : left)

      case "left":
      case "right":
        return over (OPL.top)
                    (top => top < MIN_WINDOW_OFFSET
                             ? MIN_WINDOW_OFFSET
                             : top + ovl .height > window .innerHeight - MIN_WINDOW_OFFSET
                             ? window .innerHeight - MIN_WINDOW_OFFSET - ovl .height
                             : top)

      default:
        return ident
    }
  }

const getArrowPosition: (arrow_size: number) =>
                        (overlay_coords: ClientRect | DOMRect) =>
                        (position: Position) =>
                        (centered_coords: Record<OverlayPosition>) =>
                        (adjusted_coords: Record<OverlayPosition>) => Record<OverlayPosition> =
  arrow_size => ovl => pos => centered => adjusted => {
    switch (pos) {
      case "top":
        return OverlayPosition ({
          left: ovl .width * 0.5 - arrow_size * 0.5 - 1 - OPA.left (adjusted) + OPA.left (centered),
          top: ovl .height - (arrow_size * 0.5 + 1.5),
        })

      case "bottom":
        return OverlayPosition ({
          left: ovl .width * 0.5 - arrow_size * 0.5 - 1 - OPA.left (adjusted) + OPA.left (centered),
          top: -arrow_size * 0.5 - 0.5,
        })

      case "left":
        return OverlayPosition ({
          left: ovl .width - (arrow_size * 0.5 + 1.5),
          top: ovl .height * 0.5 - arrow_size * 0.5 - 1 - OPA.top (adjusted) + OPA.top (centered),
        })

      case "right":
        return OverlayPosition ({
          left: -arrow_size * 0.5 - 0.5,
          top: ovl .height * 0.5 - arrow_size * 0.5 - 1 - OPA.top (adjusted) + OPA.top (centered),
        })

      default:
        return OverlayPosition.default
    }
  }

const alignToElement: (arrow_size: number) =>
                      (ref: React.RefObject<HTMLDivElement>) =>
                      (trigger: Element) =>
                      (defPosition: Position) =>
                      (margin: number) => [Position, React.CSSProperties, React.CSSProperties] =
  arrow_size => ref => trg => def_pos => m => {
    if (ref .current !== null) {
      const triggerCoord = trg .getBoundingClientRect ()
      const overlayCoord = ref .current .getBoundingClientRect ()

      const pos = getPositionIfNotEnoughFreeSpace (triggerCoord) (overlayCoord) (m) (def_pos)

      const centered_coords = getCenteredOverlayPosition (triggerCoord) (overlayCoord) (m) (pos)

      const adjusted_coords = adjustCrossAxis (overlayCoord) (pos) (centered_coords)

      const arrow_position = getArrowPosition (arrow_size)
                                              (overlayCoord)
                                              (pos)
                                              (centered_coords)
                                              (adjusted_coords)

      return [ pos, toObject (adjusted_coords), toObject (arrow_position) ]
    }

    return [ def_pos, {}, {} ]
  }

interface Props {
  className?: string
  margin?: number
  position?: Position
  small?: boolean
  trigger: Element
}

export const Overlay: React.FC<Props> = props => {
  const {
    children,
    className,
    margin = 0,
    position: defPosition = "top",
    small,
    trigger,
  } = props

  const [ position, setPosition ] = React.useState<Position> (defPosition)
  const [ style, setStyle ] = React.useState<React.CSSProperties> ({ visibility: "hidden" })
  const [ arrowStyle, setArrowStyle ] = React.useState<React.CSSProperties> ({})
  const overlayRef = React.useRef<HTMLDivElement> (null)

  const arrow_size = small === true ? 6 : 12

  React.useEffect (
    () => {
      const [ new_pos, new_coords, new_arrow_coords ] =
        alignToElement (arrow_size) (overlayRef) (trigger) (defPosition) (margin)

      setPosition (new_pos)
      setArrowStyle ({ height: arrow_size, width: arrow_size, ...new_arrow_coords })
      setStyle (new_coords)
    },
    [ setPosition, setStyle, defPosition, margin, trigger, setArrowStyle, arrow_size ]
  )

  return (
    <div
      style={style}
      className={
        classListMaybe (List (
          Just (`overlay overlay-${position}`),
          Maybe (className)
        ))
      }
      ref={overlayRef}
      >
      {children}
      <div className="arrow" style={arrowStyle} />
    </div>
  )
}
