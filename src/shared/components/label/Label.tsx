import { classList } from "@elyukai/utils/classList"
import type { FC } from "react"
import "./Label.css"

type Props = {
  className?: string
  disabled?: boolean
  text?: string
}

/**
 * A label.
 */
export const Label: FC<Props> = props => {
  const { className, disabled, text } = props

  return <label className={classList(className, { disabled })}>{text}</label>
}
