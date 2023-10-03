import { FC } from "react"

type Props = {
  current: number
  max: number
  horizontal?: boolean
}

/**
 * The active part of the progress bar.
 */
export const ProgressBarOverlay: FC<Props> = props => {
  const { current, max, horizontal } = props

  const style =
    horizontal === true
      ? { width: `${(current / max) * 100}%` }
      : { height: `${(current / max) * 100}%` }

  return <div className="progress-bar-overlay" style={style} />
}
