import * as React from "react";
import { List } from "../../../Data/List";
import { guardReplace, Just, Maybe, orN } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";
import { ProgressBarOverlay } from "./ProgressBarOverlay";

interface Props {
  className?: string
  current: number
  fullWidth?: boolean
  horizontal?: boolean
  max: number
}

export const ProgressBar: React.FC<Props> = props => {
  const { className, current, fullWidth, horizontal, max } = props

  return (
    <div
      className={
        classListMaybe (List (
          Just ("progressbar"),
          Maybe (className),
          guardReplace (orN (fullWidth)) ("fullWidth"),
          guardReplace (orN (horizontal)) ("horizontal")
        ))
      }
      >
      <ProgressBarOverlay
        current={current}
        horizontal={horizontal}
        max={max}
        />
    </div>
  )
}
