import { FC, memo, useCallback, useMemo } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedActiveRitual } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useActiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { SelectGetById } from "../../../../selectors/basicCapabilitySelectors.ts"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import {
  decrementRitual,
  incrementRitual,
  removeRitual,
  setRitual,
} from "../../../../slices/ritualsSlice.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillCheck } from "../skills/SkillCheck.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"
import { SkillRating } from "../skills/SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  ritual: DisplayedActiveRitual
  sortOrder: SpellsSortOrder
}

const ActiveRitualsListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    ritual: {
      dynamic: { value },
      static: { id, check, check_penalty, property, improvement_cost, translations },
      maximum,
      minimum,
      isDecreasable,
      isIncreasable,
      isUnfamiliar,
    },
    sortOrder,
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)
  const canRemove = useAppSelector(selectCanRemove)
  const getProperty = useAppSelector(SelectGetById.Static.Property)

  const { name = "" } = translateMap(translations) ?? {}

  const {
    handleAddPoint,
    handleRemovePoint,
    handleSetToMaximumPoints,
    handleSetToMinimumPoints,
    handleRemove,
  } = useActiveActivatableActions(
    id,
    value,
    maximum,
    minimum ?? 0,
    fromRaw(improvement_cost),
    incrementRitual,
    decrementRitual,
    setRitual,
    removeRitual,
  )

  const handleSelectForInfo = useCallback(
    () => dispatch(changeInlineLibraryEntry({ tag: "Ritual", ritual: id })),
    [dispatch, id],
  )

  const propertyName = useMemo(
    () => translateMap(getProperty(property.id.property)?.translations)?.name,
    [getProperty, property.id.property, translateMap],
  )

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={inlineLibraryEntryId?.tag === "Ritual" && inlineLibraryEntryId.ritual === id}
      unrecommended={isUnfamiliar}
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup
        text={
          sortOrder === SpellsSortOrder.Group
            ? `${propertyName} / ${translate("Rituals")}`
            : propertyName
        }
      />
      <ListItemValues>
        <SkillRating sr={value} />
        <SkillCheck check={check} checkPenalty={check_penalty} />
        <SkillFill />
        <SkillImprovementCost ic={fromRaw(improvement_cost)} />
      </ListItemValues>
      <SkillButtons
        addDisabled={!isIncreasable}
        removeDisabled={!isDecreasable}
        addPoint={handleAddPoint}
        setToMax={handleSetToMaximumPoints}
        removePoint={canRemove ? (value === 0 ? handleRemovePoint : handleRemove) : undefined}
        setToMin={canRemove && value > 0 ? handleSetToMinimumPoints : undefined}
        decrementIsRemove={value === 0}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
}

/**
 * Displays a ritual that is currently active.
 */
const MemoActiveRitualsListItem = memo(ActiveRitualsListItem)

export { MemoActiveRitualsListItem as ActiveRitualsListItem }
