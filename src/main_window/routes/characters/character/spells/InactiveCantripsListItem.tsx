import type { Cantrip_ID } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import { useCallback, type FC } from "react"
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
  add: (id: Cantrip_ID) => void
  selectedInlineLibraryEntryId?: DisplayableMainIdentifier
}

/**
 * Displays a cantrip that is currently inactive.
 */
export const InactiveCantripsListItem: FC<Props> = observer(props => {
  const {
    insertTopMargin,
    cantrip: { id, name, groupName, associatedText, isUnfamiliar },
    displayGroup,
    add,
    selectedInlineLibraryEntryId,
  } = props

  const handleAdd = useCallback(() => {
    add(id)
  }, [add, id])

  const handleSelectForInfo = useCallback(
    () => InlineLibraryManager.instance.goTo(["Cantrip", id]),
    [id],
  )

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={
        selectedInlineLibraryEntryId?.[0] === "Blessing" && selectedInlineLibraryEntryId[1] === id
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
      <SkillButtons addPoint={handleAdd} selectForInfo={handleSelectForInfo} />
    </ListItem>
  )
})
