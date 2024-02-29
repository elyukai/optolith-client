import { FC } from "react"

type Props = {
  isNotActive?: boolean
  noIncrease?: boolean
  sr?: number
}

/**
 * Returns a row section that displays a skill rating.
 */
export const SkillRating: FC<Props> = props => {
  const { isNotActive, noIncrease, sr } = props

  if (typeof sr === "number") {
    return <div className="sr">{sr}</div>
  } else if (isNotActive !== true && noIncrease !== true) {
    return <div className="sr empty" />
  }

  return null
}
