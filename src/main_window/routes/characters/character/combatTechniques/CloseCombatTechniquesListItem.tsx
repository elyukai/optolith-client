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
import { DisplayedCloseCombatTechnique } from "../../../../selectors/combatTechniquesSelectors.ts"
import {
  decrementCloseCombatTechnique,
  incrementCloseCombatTechnique,
  setCloseCombatTechnique,
} from "../../../../slices/closeCombatTechniqueSlice.ts"
import { selectStaticAttributes } from "../../../../slices/databaseSlice.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import { SkillAdditionalValues } from "../skills/SkillAdditionalValues.tsx"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"
import { SkillRating } from "../skills/SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  closeCombatTechnique: DisplayedCloseCombatTechnique
}

const CloseCombatTechniquesListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    closeCombatTechnique: {
      static: { id, primary_attribute, improvement_cost, translations },
      dynamic: { value },
      maximum,
      minimum,
      isIncreasable,
      isDecreasable,
      attackBase,
      parryBase,
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
      incrementCloseCombatTechnique,
      decrementCloseCombatTechnique,
      setCloseCombatTechnique,
    )

  const handleSelectForInfo = useCallback(
    () =>
      dispatch(
        changeInlineLibraryEntry({ tag: "CloseCombatTechnique", close_combat_technique: id }),
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
        inlineLibraryEntryId?.tag === "CloseCombatTechnique" &&
        inlineLibraryEntryId.close_combat_technique === id
      }
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup text={translate("Close Combat")} />
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
              value: parryBase ?? "—",
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
 * Displays a close combat technique.
 */
const MemoCloseCombatTechniquesListItem = memo(CloseCombatTechniquesListItem)

export { MemoCloseCombatTechniquesListItem as CloseCombatTechniquesListItem }
