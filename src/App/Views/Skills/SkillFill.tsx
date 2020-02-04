import * as React from "react"
import { orN } from "../../../Data/Maybe"

interface Props {
  addFillElement?: boolean
}

export const SkillFill: React.FC<Props> = props => {
  const { addFillElement } = props

  return orN (addFillElement) ? <div className="fill" /> : null
}
