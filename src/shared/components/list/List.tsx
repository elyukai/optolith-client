import { classList } from "@elyukai/utils/classList"
import type { FCC } from "../../utils/react.ts"
import "./List.scss"

type Props = {
  className?: string
}

/**
 * A table-style list.
 */
export const List: FCC<Props> = props => {
  const { children, className } = props

  return <ul className={classList("list-wrapper", className)}>{children}</ul>
}
