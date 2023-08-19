import { FC } from "react"

type Props = {
  current: number | undefined
  max: number | undefined
}

export const TextFieldCounter: FC<Props> = ({ current = 0, max }) =>
  typeof max === "number" ? (
    <div>
      {current}
      {" / "}
      {max}
    </div>
  ) : null
