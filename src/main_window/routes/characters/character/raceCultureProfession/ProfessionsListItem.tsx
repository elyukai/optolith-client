import { observer } from "mobx-react-lite"
import { useCallback, type FC } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemButtons } from "../../../../../shared/components/list/ListItemButtons.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { ProfessionForDisplay } from "../../../../../shared/domain/profession.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"

export type Props = {
  profession: ProfessionForDisplay
  showAddSlidein: () => void
}

export const ProfessionsListItem: FC<Props> = observer(props => {
  const {
    profession: { versionId, packageId, name, apValue, sources },
    showAddSlidein,
  } = props

  const translate = useTranslate()
  const { professionVersionId: currentVersionId } = useCharacterState()
  const { setProfessionPackage } = useCharacterActions()

  const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary(
    "ProfessionVersion",
    versionId,
  )

  const handleSelect = useCallback(
    () => setProfessionPackage(packageId),
    [setProfessionPackage, packageId],
  )

  return (
    <ListItem active={isActiveInInlineLibrary}>
      <ListItemName name={name} />
      <ListItemSeparator />
      <ListItemGroup small>{sources}</ListItemGroup>
      <ListItemValues>
        <div className="cost">{apValue}</div>
      </ListItemValues>
      <ListItemButtons>
        <IconButton
          icon="&#xE90a;"
          onClick={handleSelect}
          disabled={currentVersionId === versionId}
          label={translate("Select Profession")}
        />
        <IconButton
          icon="&#xE90e;"
          onClick={showAddSlidein}
          disabled={currentVersionId !== versionId}
          label={translate("Finalize Race, Culture and Profession Selection")}
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
