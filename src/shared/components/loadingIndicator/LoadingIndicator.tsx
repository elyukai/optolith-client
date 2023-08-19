import { FC } from "react"
import "./LoadingIndicator.scss"

type Props = {
  text?: string
}

export const LoadingIndicator: FC<Props> = props => {
  const { text } = props

  return (
    <div className="loading-indicator">
      <div className="loading-indicator-icon" />
      {text === undefined ? null : <div className="loading-indicator-description">{text}</div>}
    </div>
  )
}
