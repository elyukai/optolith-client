import { observer } from "mobx-react-lite"
import { useCallback, type FC } from "react"
import { useDispatch } from "react-redux"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemButtons } from "../../../../../shared/components/list/ListItemButtons.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { CultureForDisplay } from "../../../../../shared/domain/culture.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { goToTab } from "../../../../slices/routeSlice.ts"

export type CulturesListItemProps = {
  culture: CultureForDisplay
}

export const CulturesListItem: FC<CulturesListItemProps> = observer(props => {
  const {
    culture: { id, name, apValue },
  } = props

  const translate = useTranslate()
  const { cultureId: currentId, id: characterId } = useCharacterState()
  const { setCulture } = useCharacterActions()

  const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary("Culture", id)

  const handleSelect = useCallback(() => setCulture(id), [setCulture, id])

  const dispatch = useDispatch()
  const switchToProfessions = useCallback(
    () => dispatch(goToTab(["characters", characterId, "profession"])),
    [dispatch],
  )

  return (
    <ListItem active={isActiveInInlineLibrary}>
      <ListItemName name={name} />
      <ListItemSeparator />
      <ListItemValues>
        <div className="cost">{apValue}</div>
      </ListItemValues>
      <ListItemButtons>
        <IconButton
          icon="&#xE90a;"
          onClick={handleSelect}
          disabled={currentId === id}
          label={translate("Select Culture")}
        />
        <IconButton
          icon="&#xE90e;"
          onClick={switchToProfessions}
          disabled={currentId !== id}
          label={translate("Go to Profession Selection")}
        />
        <IconButton
          icon="&#xE912;"
          onClick={displayInlineLibraryEntry}
          label={translate("Show details")}
          flat
        />
      </ListItemButtons>
    </ListItem>
  )
})
