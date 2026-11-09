import { observer } from "mobx-react-lite"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedSkill } from "../../../../../shared/domain/rated/skill.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { selectSkillsCultureRatingVisibility } from "../../../../slices/settingsSlice.ts"
import { SkillButtons } from "./SkillButtons.tsx"
import { SkillCheck } from "./SkillCheck.tsx"
import { SkillImprovementCost } from "./SkillImprovementCost.tsx"
import { SkillRating } from "./SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  skill: DisplayedSkill
}

export const SkillListItem: React.FC<Props> = observer(function SkillListItem(props) {
  const { insertTopMargin, skill } = props
  const { id, groupName, name, commonness } = skill

  const cultureRatingVisibility = useAppSelector(selectSkillsCultureRatingVisibility)

  const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary("Skill", id)

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={isActiveInInlineLibrary}
      recommended={cultureRatingVisibility && commonness === "common"}
      unrecommended={cultureRatingVisibility && commonness === "uncommon"}
    >
      <ListItemName name={name} onClick={displayInlineLibraryEntry} />
      <ListItemSeparator />
      <ListItemGroup text={groupName} />
      <ListItemValues>
        <SkillRating entry={skill} />
        <SkillCheck entry={skill} />
        <SkillImprovementCost entry={skill} />
      </ListItemValues>
      <SkillButtons entityName="Skill" entry={skill} selectForInfo={displayInlineLibraryEntry} />
    </ListItem>
  )
})
