import * as React from "react";
import { orN } from "../../../Data/Maybe";

export interface SkillFillProps {
  addFillElement?: boolean
}

export function SkillFill (props: SkillFillProps) {
  const { addFillElement } = props

  return orN (addFillElement) ? <div className="fill" /> : null
}
