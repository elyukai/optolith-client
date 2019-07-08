import * as React from "react";
import { List } from "../../../Data/List";
import { guardReplace, Just, Maybe, orN } from "../../../Data/Maybe";
import { classListMaybe } from "../../Utilities/CSS";
import { ProgressBarOverlay, ProgressBarOverlayProps } from "./ProgressBarOverlay";

export interface ProgressBarProps extends ProgressBarOverlayProps {
  className?: string
  fullWidth?: boolean
}

export function ProgressBar (props: ProgressBarProps) {
  const { className, fullWidth, horizontal, ...other } = props

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
      <ProgressBarOverlay horizontal={horizontal} {...other} />
    </div>
  )
}
