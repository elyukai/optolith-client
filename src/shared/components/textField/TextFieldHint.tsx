import type { FC } from "react"
import { classList } from "@elyukai/utils/classList"

type Props = {
  hint: string | undefined
  isFieldEmpty: boolean
}

/**
 * Displays a hint for a textfield.
 */
export const TextFieldHint: FC<Props> = ({ hint, isFieldEmpty }) =>
  hint === undefined ? null : (
    <div className={classList("textfield-hint", { hide: !isFieldEmpty })}>{hint}</div>
  )
