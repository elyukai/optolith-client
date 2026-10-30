import { useCallback, type FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedAttribute } from "../../../../../shared/domain/rated/attribute.ts"
import type { DisplayedInactiveLiturgicalChant } from "../../../../../shared/domain/rated/liturgicalChant.ts"
import type { DisplayedInactiveSpellwork } from "../../../../../shared/domain/rated/spell.ts"
import { SharedActions } from "../../../../external.ts"
import {
  InlineLibraryManager,
  type DisplayableMainIdentifier,
} from "../../../../inlineLibrary/InlineLibrary.tsx"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillCheck } from "../skills/SkillCheck.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"

type Props = {
  insertTopMargin?: boolean
  entry: DisplayedInactiveSpellwork | DisplayedInactiveLiturgicalChant
  displayGroup?: boolean
  attributes: DisplayedAttribute[]
  selectedInlineLibraryEntryId?: DisplayableMainIdentifier
}

export const InactiveActivatableRatedListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    entry: {
      type,
      id,
      check,
      checkPenalty,
      improvementCost,
      name,
      groupName,
      associatedText,
      isAvailable,
    },
    displayGroup,
    attributes,
    selectedInlineLibraryEntryId,
  } = props

  const handleAdd = useCallback(() => SharedActions.activateRated(type, id), [id])

  const handleSelectForInfo = useCallback(
    () => InlineLibraryManager.instance.goTo([type, id]),
    [id],
  )

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={selectedInlineLibraryEntryId?.[0] === type && selectedInlineLibraryEntryId[1] === id}
      disabled={!isAvailable}
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup text={displayGroup ? `${associatedText} / ${groupName}` : associatedText} />
      <ListItemValues>
        <SkillCheck check={check} checkPenalty={checkPenalty} attributes={attributes} />
        <SkillFill />
        <SkillImprovementCost ic={improvementCost} />
      </ListItemValues>
      <SkillButtons
        addDisabled={!isAvailable}
        addPoint={handleAdd}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
}
