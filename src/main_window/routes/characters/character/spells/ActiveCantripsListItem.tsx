import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedCantrip } from "../../../../../shared/domain/rated/spell.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { SkillFill } from "../skills/SkillFill.tsx"
import { TinyActivatableButtons } from "../TinyActivatableButtons.tsx"

type Props = {
  insertTopMargin?: boolean
  cantrip: DisplayedCantrip
  displayGroup?: boolean
}

/**
 * Displays a cantrip that is currently active.
 */
export const ActiveCantripsListItem: FC<Props> = observer(props => {
  const { insertTopMargin, cantrip, displayGroup } = props
  const { id, associatedText, name, groupName, isUnfamiliar } = cantrip

  const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary("Cantrip", id)

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={isActiveInInlineLibrary}
      noIncrease
      unrecommended={isUnfamiliar}
    >
      <ListItemName name={name} onClick={displayInlineLibraryEntry} />
      <ListItemSeparator />
      <ListItemGroup text={displayGroup ? `${associatedText} / ${groupName}` : associatedText} />
      <ListItemValues>
        <SkillFill />
      </ListItemValues>
      <TinyActivatableButtons
        entityName="Cantrip"
        entry={cantrip}
        active
        selectForInfo={displayInlineLibraryEntry}
      />
    </ListItem>
  )
})
