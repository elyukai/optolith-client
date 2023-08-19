import { classList } from "../../utils/classList.ts"
import { FCC } from "../../utils/react.ts"

type Props = {
  group?: number
  getGroupName?: (group: number) => string
  small?: boolean
  text?: string
}

export const ListItemGroup: FCC<Props> = props => {
  const { children, group, getGroupName, small, text } = props

  const content =
    group !== undefined && typeof getGroupName === "function"
      ? getGroupName(group)
      : typeof text === "string"
      ? text
      : children

  return <div className={classList("group", { "small-info-text": small })}>{content}</div>
}
