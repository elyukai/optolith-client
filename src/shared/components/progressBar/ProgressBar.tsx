import { FC } from "react"
import { classList } from "../../utils/classList.ts"
import "./ProgressBar.scss"
import { ProgressBarOverlay } from "./ProgressBarOverlay.tsx"

type Props = {
  className?: string
  current: number
  orientation: "vertical" | "horizontal"
  max: number
}

export const ProgressBar: FC<Props> = props => {
  const { className, current, orientation, max } = props

  return (
    <div
      className={
        classList(
          "progress-bar",
          className,
          { "progress-bar--horizontal": orientation === "horizontal" },
        )
      }
      >
      <ProgressBarOverlay
        current={current}
        horizontal={orientation === "horizontal"}
        max={max}
        />
    </div>
  )
}
