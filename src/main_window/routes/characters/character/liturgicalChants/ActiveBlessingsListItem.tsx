import type { Blessing_ID } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import { useCallback, type FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedBlessing } from "../../../../../shared/domain/rated/liturgicalChant.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"

type Props = {
  insertTopMargin?: boolean
  blessing: DisplayedBlessing
  displayGroup?: boolean
  remove: (id: Blessing_ID) => void
}

/**
 * Displays a blessing that is currently active.
 */
export const ActiveBlessingsListItem: FC<Props> = observer(props => {
  const {
    insertTopMargin,
    blessing: { id, name, groupName },
    displayGroup,
    remove,
  } = props

  const { canRemove } = useCharacterState()
  const handleRemove = useCallback(() => {
    remove(id)
  }, [remove, id])

  const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary("Blessing", id)

  const aspects = "" // TODO

  return (
    <ListItem insertTopMargin={insertTopMargin} active={isActiveInInlineLibrary} noIncrease>
      <ListItemName name={name} onClick={displayInlineLibraryEntry} />
      <ListItemSeparator />
      <ListItemGroup text={displayGroup ? `${aspects} / ${groupName}` : aspects} />
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
