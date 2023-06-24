import { FC } from "react"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"

type Props = {
  addText?: string
  group?: number
  getGroupName?: (id: number) => string
}

export const SkillGroup: FC<Props> = props => {
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
