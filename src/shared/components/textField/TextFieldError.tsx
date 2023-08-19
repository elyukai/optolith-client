import { FC } from "react"

type Props = {
  error: string | undefined
}

export const TextFieldError: FC<Props> = ({ error }) =>
  error !== undefined && error !== "" ? <p className="error">{error}</p> : null
