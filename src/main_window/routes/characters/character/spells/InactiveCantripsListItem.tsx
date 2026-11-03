import type { Cantrip_ID } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import { useCallback, type FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedCantrip } from "../../../../../shared/domain/rated/spell.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"

type Props = {
  insertTopMargin?: boolean
  cantrip: DisplayedCantrip
  displayGroup?: boolean
  add: (id: Cantrip_ID) => void
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
  } = props

  const handleAdd = useCallback(() => {
    add(id)
  }, [add, id])

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
      <SkillButtons addPoint={handleAdd} selectForInfo={displayInlineLibraryEntry} />
    </ListItem>
  )
})
