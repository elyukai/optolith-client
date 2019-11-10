import * as React from "react";

export interface SkillRatingProps {
  isNotActive?: boolean
  noIncrease?: boolean
  sr?: number
  addPoint? (id: string): void
}

export function SkillRating (props: SkillRatingProps) {
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
