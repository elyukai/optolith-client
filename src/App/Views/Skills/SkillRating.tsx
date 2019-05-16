import * as React from "react";

export interface SkillRatingProps {
  isNotActive?: boolean
  noIncrease?: boolean
  sr?: number
  addPoint? (): void
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
  else if (!addPoint && isNotActive !== true && noIncrease !== true) {
    return (
      <div className="sr empty" />
    )
  }

  return null
}
