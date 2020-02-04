import * as React from "react"

interface Props {
  isNotActive?: boolean
  noIncrease?: boolean
  sr?: number
  addPoint? (id: string): void
}

export const SkillRating: React.FC<Props> = props => {
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
