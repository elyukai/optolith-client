import type { Cantrip_ID } from "@optolith/database-schema/gen"
import { memo, useCallback, type FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedCantrip } from "../../../../../shared/domain/rated/spell.ts"
import {
  InlineLibraryManager,
  type DisplayableMainIdentifier,
} from "../../../../inlineLibrary/InlineLibrary.tsx"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"

type Props = {
  insertTopMargin?: boolean
  cantrip: DisplayedCantrip
  displayGroup?: boolean
  remove: (id: Cantrip_ID) => void
  canRemove: boolean
  selectedInlineLibraryEntryId?: DisplayableMainIdentifier
}

const ActiveCantripsListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    cantrip: { id, associatedText, name, groupName, isUnfamiliar },
    displayGroup,
    remove,
    canRemove,
    selectedInlineLibraryEntryId,
  } = props

  const handleRemove = useCallback(() => {
    remove(id)
  }, [remove, id])

  const handleSelectForInfo = useCallback(
    () => InlineLibraryManager.instance.goTo(["Blessing", id]),
    [id],
  )

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={
        selectedInlineLibraryEntryId?.[0] === "Cantrip" && selectedInlineLibraryEntryId[1] === id
      }
      noIncrease
      unrecommended={isUnfamiliar}
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup text={displayGroup ? `${associatedText} / ${groupName}` : associatedText} />
      <ListItemValues>
        <SkillFill />
      </ListItemValues>
      <SkillButtons
        removePoint={canRemove ? handleRemove : undefined}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
}

/**
 * Displays a cantrip that is currently active.
 */
const MemoActiveCantripsListItem = memo(ActiveCantripsListItem)

export { MemoActiveCantripsListItem as ActiveCantripsListItem }
