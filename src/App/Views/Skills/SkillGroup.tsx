import * as React from "react"
import { List } from "../../../Data/List"
import { ListItemGroup } from "../Universal/ListItemGroup"

interface Props {
  addText?: string
  groupList?: List<string>
  groupIndex?: number
}

export const SkillGroup: React.FC<Props> = props => {
  const {
    addText,
    groupIndex,
    groupList,
  } = props

  if (addText === undefined && (groupIndex === undefined || groupList === undefined)) {
    return null
  }

  return (
    <ListItemGroup index={groupIndex} list={groupList} text={addText} />
  )
}
