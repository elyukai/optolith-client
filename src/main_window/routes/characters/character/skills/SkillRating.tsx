import { FC } from "react"

type Props = {
  isNotActive?: boolean
  noIncrease?: boolean
  sr?: number
  addPoint?(id: number): void
}

export const SkillRating: FC<Props> = props => {
  const {
    isNotActive,
    noIncrease,
    sr,
    addPoint,
  } = props

  if (typeof sr === "number") {
    return (
      <div className="sr">
        {sr}
      </div>
    )
  }
  else if (addPoint === undefined && isNotActive !== true && noIncrease !== true) {
    return (
      <div className="sr empty" />
    )
  }

  return null
}
