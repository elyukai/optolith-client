import { classList } from "@elyukai/utils/classList"
import type { FCC } from "../../utils/react.ts"
import "./VerticalList.scss"

type Props = {
  className?: string
}

/**
 * Displays a list of elements vertically, separated by dots.
 */
export const VerticalList: FCC<Props> = props => {
  const { children, className } = props

  return <div className={classList("vertical-list", className)}>{children}</div>
}
