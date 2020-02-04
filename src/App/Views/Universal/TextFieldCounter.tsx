import * as React from "react"
import { isNumber } from "../../Utilities/typeCheckUtils"

interface Props {
  current: number | undefined
  max: number | undefined
}

export const TextFieldCounter: React.FC<Props> = ({ current, max }) =>
  isNumber (max)
    ? (
      <div>
        {current}
        {" / "}
        {max}
      </div>
    )
    : null
