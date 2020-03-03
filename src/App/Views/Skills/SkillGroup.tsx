import * as React from "react"
import { ListItemGroup } from "../Universal/ListItemGroup"

interface Props {
  addText?: string
  group?: number
  getGroupName?: (id: number) => string
}

export const SkillGroup: React.FC<Props> = props => {
  const {
    addText,
    group,
    getGroupName,
  } = props

  if (addText === undefined && (group === undefined || getGroupName === undefined)) {
    return null
  }

  return (
    <ListItemGroup group={group} getGroupName={getGroupName} text={addText} />
  )
}
