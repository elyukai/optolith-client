import { FC } from "react"

type Props = {
  error: string | undefined
}

/**
 * Displays an error for a text field.
 */
export const TextFieldError: FC<Props> = ({ error }) =>
  error !== undefined && error !== "" ? <p className="error">{error}</p> : null
