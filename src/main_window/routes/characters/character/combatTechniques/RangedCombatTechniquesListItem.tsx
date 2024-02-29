import { FC, memo, useCallback } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useRatedActions } from "../../../../hooks/ratedActions.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import { DisplayedRangedCombatTechnique } from "../../../../selectors/combatTechniquesSelectors.ts"
import { selectStaticAttributes } from "../../../../slices/databaseSlice.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import {
  decrementRangedCombatTechnique,
  incrementRangedCombatTechnique,
  setRangedCombatTechnique,
} from "../../../../slices/rangedCombatTechniqueSlice.ts"
import { SkillAdditionalValues } from "../skills/SkillAdditionalValues.tsx"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"
import { SkillRating } from "../skills/SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  rangedCombatTechnique: DisplayedRangedCombatTechnique
}

const RangedCombatTechniquesListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    rangedCombatTechnique: {
      static: { id, primary_attribute, improvement_cost, translations },
      dynamic: { value },
      maximum,
      minimum,
      isIncreasable,
      isDecreasable,
      attackBase,
    },
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)
  const canRemove = useAppSelector(selectCanRemove)

  const { name = "???" } = translateMap(translations) ?? {}

  const { handleAddPoint, handleRemovePoint, handleSetToMaximumPoints, handleSetToMinimumPoints } =
    useRatedActions(
      id,
      value,
      maximum,
      minimum,
      fromRaw(improvement_cost),
      incrementRangedCombatTechnique,
      decrementRangedCombatTechnique,
      setRangedCombatTechnique,
    )

  const handleSelectForInfo = useCallback(
    () =>
      dispatch(
        changeInlineLibraryEntry({ tag: "RangedCombatTechnique", ranged_combat_technique: id }),
      ),
    [dispatch, id],
  )

  const attributes = useAppSelector(selectStaticAttributes)

  const primaryStr = primary_attribute
    .map(ref => translateMap(attributes[ref.id.attribute]?.translations)?.abbreviation ?? "")
    .join("/")

  const customClassName = `attr--${primary_attribute.map(ref => ref.id.attribute).join("-")}`

  const primaryClassName = `primary ${customClassName}`

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={
        inlineLibraryEntryId?.tag === "RangedCombatTechnique" &&
        inlineLibraryEntryId.ranged_combat_technique === id
      }
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup text={translate("Ranged Combat")} />
      <ListItemValues>
        <SkillRating sr={value} />
        <SkillImprovementCost ic={fromRaw(improvement_cost)} />
        <SkillAdditionalValues
          addValues={[
            { className: primaryClassName, value: primaryStr },
            { className: "at", value: attackBase },
            { className: "atpa" },
            {
              className: "pa",
              value: "—",
            },
          ]}
        />
      </ListItemValues>
      <SkillButtons
        addDisabled={!isIncreasable}
        removeDisabled={!isDecreasable}
        addPoint={handleAddPoint}
        setToMax={handleSetToMaximumPoints}
        removePoint={canRemove ? handleRemovePoint : undefined}
        setToMin={canRemove ? handleSetToMinimumPoints : undefined}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
}

/**
 * Displays a ranged combat technique.
 */
const MemoRangedCombatTechniquesListItem = memo(RangedCombatTechniquesListItem)

export { MemoRangedCombatTechniquesListItem as RangedCombatTechniquesListItem }
