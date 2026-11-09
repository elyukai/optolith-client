import type { FC } from "react"

type Props = {
  isNotActive?: boolean
  noIncrease?: boolean
  entry: {
    value?: number
  }
}

/**
 * Returns a row section that displays a skill rating.
 */
export const SkillRating: FC<Props> = props => {
  const {
    isNotActive,
    noIncrease,
    entry: { value },
  } = props

  if (typeof value === "number") {
    return <div className="sr">{value}</div>
  } else if (isNotActive !== true && noIncrease !== true) {
    return <div className="sr empty" />
  }

  return null
}
