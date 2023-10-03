import { FC } from "react"
import { Label } from "../label/Label.tsx"

type Props = {
  label: string | undefined
}

/**
 * Displays a label for a text field.
 */
export const TextFieldLabel: FC<Props> = ({ label }) =>
  label !== undefined && label !== "" ? <Label text={label} /> : null
