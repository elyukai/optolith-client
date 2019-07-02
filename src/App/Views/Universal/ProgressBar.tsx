import classNames from "classnames";
import * as React from "react";
import { ProgressBarOverlay, ProgressBarOverlayProps } from "./ProgressBarOverlay";

export interface ProgressBarProps extends ProgressBarOverlayProps {
  className?: string
  fullWidth?: boolean
}

export function ProgressBar (props: ProgressBarProps) {
  const { className, fullWidth, horizontal, ...other } = props

  return (
    <div className={classNames ("progressbar", className, { fullWidth, horizontal })}>
      <ProgressBarOverlay horizontal={horizontal} {...other} />
    </div>
  )
}
