import { useCallback, type FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedAttribute } from "../../../../../shared/domain/rated/attribute.ts"
import type { DisplayedActiveLiturgicalChant } from "../../../../../shared/domain/rated/liturgicalChant.ts"
import type { DisplayedActiveSpellwork } from "../../../../../shared/domain/rated/spell.ts"
import { SharedActions } from "../../../../external.ts"
import {
  InlineLibraryManager,
  type DisplayableMainIdentifier,
} from "../../../../inlineLibrary/InlineLibrary.tsx"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillCheck } from "../skills/SkillCheck.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"
import { SkillRating } from "../skills/SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  entry: DisplayedActiveSpellwork | DisplayedActiveLiturgicalChant
  displayGroup?: boolean
  attributes: DisplayedAttribute[]
  canRemove: boolean
  selectedInlineLibraryEntryId?: DisplayableMainIdentifier
}

export const ActiveActivatableRatedListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    entry: {
      type,
      id,
      check,
      checkPenalty,
      value,
      improvementCost,
      name,
      groupName,
      associatedText,
      isDecreasable,
      isIncreasable,
    },
    displayGroup,
    attributes,
    canRemove,
    selectedInlineLibraryEntryId,
  } = props

  const handleAddPoint = useCallback(() => SharedActions.incrementRated(type, id), [id])
  const handleRemovePoint = useCallback(() => SharedActions.decrementRated(type, id), [id])
  const handleSetToMaximumPoints = useCallback(
    () => SharedActions.incrementRatedToMax(type, id),
    [id],
  )
  const handleSetToMinimumPoints = useCallback(
    () => SharedActions.decrementRatedToMin(type, id),
    [id],
  )
  const handleRemove = useCallback(() => SharedActions.deactivateRated(type, id), [id])

  const handleSelectForInfo = useCallback(
    () => InlineLibraryManager.instance.goTo([type, id]),
    [id],
  )

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={selectedInlineLibraryEntryId?.[0] === type && selectedInlineLibraryEntryId[1] === id}
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup text={displayGroup ? `${associatedText} / ${groupName}` : associatedText} />
      <ListItemValues>
        <SkillRating sr={value} />
        <SkillCheck check={check} checkPenalty={checkPenalty} attributes={attributes} />
        <SkillFill />
        <SkillImprovementCost ic={improvementCost} />
      </ListItemValues>
      <SkillButtons
        addDisabled={!isIncreasable}
        removeDisabled={!isDecreasable}
        addPoint={handleAddPoint}
        setToMax={handleSetToMaximumPoints}
        removePoint={canRemove ? (value === 0 ? handleRemove : handleRemovePoint) : undefined}
        setToMin={
          canRemove && value !== undefined && value > 0 ? handleSetToMinimumPoints : undefined
        }
        decrementIsRemove={value === 0}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
}
