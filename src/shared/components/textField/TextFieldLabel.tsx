import { FC } from "react"
import { Label } from "../label/Label.tsx"

type Props = {
  label: string | undefined
}

export const TextFieldLabel: FC<Props> = ({ label }) =>
  label !== undefined && label !== ""
  ? <Label text={label} />
  : null
