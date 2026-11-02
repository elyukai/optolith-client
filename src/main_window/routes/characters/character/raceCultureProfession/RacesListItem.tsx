import { observer } from "mobx-react-lite"
import { useCallback, type FC } from "react"
import { useDispatch } from "react-redux"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemButtons } from "../../../../../shared/components/list/ListItemButtons.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { RaceForDisplay } from "../../../../../shared/domain/race.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { goToTab } from "../../../../slices/routeSlice.ts"

export type Props = {
  race: RaceForDisplay
}

export const RacesListItem: FC<Props> = observer(props => {
  const {
    race: { id, variantId, name, apValue },
  } = props

  const translate = useTranslate()
  const { raceId: currentId, id: characterId } = useCharacterState()
  const { setRaceVariant } = useCharacterActions()

  const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary("Race", id)

  const handleSelect = useCallback(() => setRaceVariant(variantId), [setRaceVariant, variantId])

  const dispatch = useDispatch()
  const switchToCultures = useCallback(
    () => dispatch(goToTab(["characters", characterId, "culture"])),
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
          label={translate("Select Race")}
        />
        <IconButton
          icon="&#xE90e;"
          onClick={switchToCultures}
          disabled={currentId !== id}
          label={translate("Go to Culture Selection")}
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
