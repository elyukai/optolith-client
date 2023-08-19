import { FC } from "react"
import { classList } from "../../utils/classList.ts"
import "./Label.scss"

type Props = {
  className?: string
  disabled?: boolean
  text?: string
}

export const Label: FC<Props> = props => {
  const { className, disabled, text } = props

  return <label className={classList(className, { disabled })}>{text}</label>
}
