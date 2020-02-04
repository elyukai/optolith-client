import * as React from "react"
import { Icon } from "./Icon"
import { Text } from "./Text"

interface Props {
  text?: string
}

export const Loader: React.FC<Props> = props => {
  const { text } = props

  return (
    <div id="loader">
      <Icon />
      <Text>{text}</Text>
    </div>
  )
}
