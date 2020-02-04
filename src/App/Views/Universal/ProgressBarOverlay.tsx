import * as React from "react";
import { orN } from "../../../Data/Maybe";

interface Props {
  current: number
  max: number
  horizontal?: boolean
}

export const ProgressBarOverlay: React.FC<Props> = props => {
  const { current, max, horizontal } = props

  const style =
    orN (horizontal)
      ? { width: `${current / max * 100}%` }
      : { height: `${current / max * 100}%` }

  return <div className="progressbar-overlay" style={style} />
}
