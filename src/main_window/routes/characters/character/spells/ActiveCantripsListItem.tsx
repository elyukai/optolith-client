import type { Cantrip_ID } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import { useCallback, type FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedCantrip } from "../../../../../shared/domain/rated/spell.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"

type Props = {
  insertTopMargin?: boolean
  cantrip: DisplayedCantrip
  displayGroup?: boolean
  remove: (id: Cantrip_ID) => void
}

/**
 * Displays a cantrip that is currently active.
 */
export const ActiveCantripsListItem: FC<Props> = observer(props => {
  const {
    insertTopMargin,
    cantrip: { id, associatedText, name, groupName, isUnfamiliar },
    displayGroup,
    remove,
  } = props

  const { canRemove } = useCharacterState()
  const handleRemove = useCallback(() => {
    remove(id)
  }, [remove, id])

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
      <SkillButtons
        removePoint={canRemove ? handleRemove : undefined}
        selectForInfo={displayInlineLibraryEntry}
      />
    </ListItem>
  )
})
