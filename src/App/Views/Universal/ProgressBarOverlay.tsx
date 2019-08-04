import * as React from "react";
import { orN } from "../../../Data/Maybe";

export interface ProgressBarOverlayProps {
  current: number
  max: number
  horizontal?: boolean
}

export function ProgressBarOverlay (props: ProgressBarOverlayProps) {
  const { current, max, horizontal } = props

  const style =
    orN (horizontal)
      ? { width: `${current / max * 100}%` }
      : { height: `${current / max * 100}%` }

  return <div className="progressbar-overlay" style={style}></div>
}
