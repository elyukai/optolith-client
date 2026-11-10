import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedInactiveLiturgicalChant } from "../../../../../shared/domain/rated/liturgicalChant.ts"
import type { DisplayedInactiveMagicalAction } from "../../../../../shared/domain/rated/magicalActions.ts"
import type { DisplayedInactiveSpellwork } from "../../../../../shared/domain/rated/spell.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillCheck } from "../skills/SkillCheck.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"

type Props = {
  insertTopMargin?: boolean
  entry:
    | DisplayedInactiveSpellwork
    | DisplayedInactiveLiturgicalChant
    | DisplayedInactiveMagicalAction
  displayGroup?: boolean
}

export const InactiveActivatableRatedListItem: FC<Props> = observer(
  function InactiveActivatableRatedListItem(props) {
    const { insertTopMargin, entry, displayGroup } = props
    const { type, id, name, groupName, associatedText, isAvailable } = entry

    const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary(type, id)

    return (
      <ListItem
        insertTopMargin={insertTopMargin}
        active={isActiveInInlineLibrary}
        disabled={!isAvailable}
      >
        <ListItemName name={name} onClick={displayInlineLibraryEntry} />
        <ListItemSeparator />
        <ListItemGroup text={displayGroup ? `${associatedText} / ${groupName}` : associatedText} />
        <ListItemValues>
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
