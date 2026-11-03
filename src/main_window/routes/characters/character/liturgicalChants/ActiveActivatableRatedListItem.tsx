import { useCallback, type FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedActiveLiturgicalChant } from "../../../../../shared/domain/rated/liturgicalChant.ts"
import type { DisplayedActiveSpellwork } from "../../../../../shared/domain/rated/spell.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillCheck } from "../skills/SkillCheck.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"
import { SkillRating } from "../skills/SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  entry: DisplayedActiveSpellwork | DisplayedActiveLiturgicalChant
  displayGroup?: boolean
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
  } = props

  const { canRemove } = useCharacterState()
  const actions = useCharacterActions()

  const handleAddPoint = useCallback(() => actions.incrementRated(type, id), [id])
  const handleRemovePoint = useCallback(() => actions.decrementRated(type, id), [id])
  const handleSetToMaximumPoints = useCallback(() => actions.incrementRatedToMax(type, id), [id])
  const handleSetToMinimumPoints = useCallback(() => actions.decrementRatedToMin(type, id), [id])
  const handleRemove = useCallback(() => actions.deactivateRated(type, id), [id])

  const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary(type, id)

  return (
    <ListItem insertTopMargin={insertTopMargin} active={isActiveInInlineLibrary}>
      <ListItemName name={name} onClick={displayInlineLibraryEntry} />
      <ListItemSeparator />
      <ListItemGroup text={displayGroup ? `${associatedText} / ${groupName}` : associatedText} />
      <ListItemValues>
        <SkillRating sr={value} />
        <SkillCheck check={check} checkPenalty={checkPenalty} />
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
        selectForInfo={displayInlineLibraryEntry}
      />
    </ListItem>
  )
}
