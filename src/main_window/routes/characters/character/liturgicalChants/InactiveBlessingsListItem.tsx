import type { Blessing_ID } from "@optolith/database-schema/gen"
import { memo, useCallback, type FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedBlessing } from "../../../../../shared/domain/rated/liturgicalChant.ts"
import {
  InlineLibraryManager,
  type DisplayableMainIdentifier,
} from "../../../../inlineLibrary/InlineLibrary.tsx"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"

type Props = {
  insertTopMargin?: boolean
  blessing: DisplayedBlessing
  displayGroup?: boolean
  add: (id: Blessing_ID) => void
  selectedInlineLibraryEntryId?: DisplayableMainIdentifier
}

const InactiveBlessingsListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    blessing: { id, name, groupName },
    displayGroup,
    add,
    selectedInlineLibraryEntryId,
  } = props

  const handleAdd = useCallback(() => {
    add(id)
  }, [add, id])

  const handleSelectForInfo = useCallback(
    () => InlineLibraryManager.instance.goTo(["Blessing", id]),
    [id],
  )

  const aspects = "" // TODO

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={
        selectedInlineLibraryEntryId?.[0] === "Blessing" && selectedInlineLibraryEntryId[1] === id
      }
      noIncrease
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup text={displayGroup ? `${aspects} / ${groupName}` : aspects} />
      <ListItemValues>
        <SkillFill />
      </ListItemValues>
      <SkillButtons addPoint={handleAdd} selectForInfo={handleSelectForInfo} />
    </ListItem>
  )
}

/**
 * Displays a blessing that is currently inactive.
 */
const MemoInactiveBlessingsListItem = memo(InactiveBlessingsListItem)

export { MemoInactiveBlessingsListItem as InactiveBlessingsListItem }
