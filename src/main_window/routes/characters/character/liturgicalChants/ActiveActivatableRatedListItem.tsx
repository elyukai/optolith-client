import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedActiveLiturgicalChant } from "../../../../../shared/domain/rated/liturgicalChant.ts"
import type { DisplayedActiveMagicalAction } from "../../../../../shared/domain/rated/magicalActions.ts"
import type { DisplayedActiveSpellwork } from "../../../../../shared/domain/rated/spell.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillCheck } from "../skills/SkillCheck.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"
import { SkillRating } from "../skills/SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  entry: DisplayedActiveSpellwork | DisplayedActiveLiturgicalChant | DisplayedActiveMagicalAction
  displayGroup?: boolean
}

export const ActiveActivatableRatedListItem: FC<Props> = observer(
  function ActiveActivatableRatedListItem(props) {
    const { insertTopMargin, entry, displayGroup } = props
    const { type, id, name, groupName, associatedText } = entry

    const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary(type, id)

    return (
      <ListItem insertTopMargin={insertTopMargin} active={isActiveInInlineLibrary}>
        <ListItemName name={name} onClick={displayInlineLibraryEntry} />
        <ListItemSeparator />
        <ListItemGroup text={displayGroup ? `${associatedText} / ${groupName}` : associatedText} />
        <ListItemValues>
          <SkillRating entry={entry} />
          <SkillCheck entry={entry} />
          <SkillFill />
          <SkillImprovementCost entry={entry} />
        </ListItemValues>
        <SkillButtons
          entityName={entry.type}
          entry={entry}
          selectForInfo={displayInlineLibraryEntry}
        />
      </ListItem>
    )
  },
)
