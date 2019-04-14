import * as React from "react";

export interface ProgressBarOverlayProps {
  current: number
  max: number
  horizontal?: boolean
}

export function ProgressBarOverlay (props: ProgressBarOverlayProps) {
  const { current, max, horizontal } = props

  const style =
    horizontal === true
      ? { width: `${current / max * 100}%` }
      : { height: `${current / max * 100}%` }

  return <div className="progressbar-overlay" style={style}></div>
}
