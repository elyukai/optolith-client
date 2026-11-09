import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedBlessing } from "../../../../../shared/domain/rated/liturgicalChant.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { SkillFill } from "../skills/SkillFill.tsx"
import { TinyActivatableButtons } from "../TinyActivatableButtons.tsx"

type Props = {
  insertTopMargin?: boolean
  blessing: DisplayedBlessing
  displayGroup?: boolean
}

/**
 * Displays a blessing that is currently inactive.
 */
export const InactiveBlessingsListItem: FC<Props> = observer(props => {
  const { insertTopMargin, blessing, displayGroup } = props
  const { id, name, groupName } = blessing

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
      <TinyActivatableButtons
        entityName="Blessing"
        entry={blessing}
        selectForInfo={displayInlineLibraryEntry}
      />
    </ListItem>
  )
})
