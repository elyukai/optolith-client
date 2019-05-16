import * as React from "react";
import { List } from "../../../Data/List";
import { ListItemGroup } from "../Universal/ListItemGroup";

export interface SkillListItemProps {
  addText?: string
  groupList?: List<string>
  groupIndex?: number
}

export function SkillGroup (props: SkillListItemProps) {
  const {
    addText,
    groupIndex,
    groupList,
  } = props

  if (addText !== undefined || groupIndex !== undefined && groupList) {
    return (
      <ListItemGroup index={groupIndex} list={groupList} text={addText}/>
    )
  }

  return null
}
