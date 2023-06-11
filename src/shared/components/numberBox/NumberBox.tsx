import { FC } from "react"
import "./NumberBox.scss"

type Props = {
  current?: number
  max?: number
}

export const NumberBox: FC<Props> = ({ current, max }) => (
  <div className="number-box">
    {current === undefined ? null : <span className="current">{current}</span>}
    {max === undefined ? null : <span className="max">{max}</span>}
  </div>
)
