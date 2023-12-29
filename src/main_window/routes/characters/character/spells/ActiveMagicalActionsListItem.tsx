import { SkillCheckPenalty } from "optolith-database-schema/types/_SkillCheck"
import { ReactNode, useCallback, useMemo } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { ImprovementCost } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { createIdentifierObject } from "../../../../../shared/domain/identifier.ts"
import { DisplayedActiveMagicalAction } from "../../../../../shared/domain/rated/spellActive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { deepEqual } from "../../../../../shared/utils/compare.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import { selectGetProperty } from "../../../../slices/databaseSlice.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillCheck } from "../skills/SkillCheck.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"
import { SkillRating } from "../skills/SkillRating.tsx"

type Kind =
  | "Curse"
  | "ElvenMagicalSong"
  | "DominationRitual"
  | "MagicalMelody"
  | "MagicalDance"
  | "JesterTrick"
  | "AnimistPower"
  | "GeodeRitual"
  | "ZibiljaRitual"

type Props<T extends DisplayedActiveMagicalAction> = {
  kind: Kind
  insertTopMargin?: boolean
  magicalAction: T
  sortOrder: SpellsSortOrder
  groupName: string
  checkPenalty?: SkillCheckPenalty
  improvementCost?: ImprovementCost
  addPoint: (id: number) => void
  removePoint: (id: number) => void
  remove: (id: number) => void
}

/**
 * Displays a spell that is currently inactive.
 */
export const ActiveMagicalActionsListItem = <T extends DisplayedActiveMagicalAction>(
  props: Props<T>,
): ReactNode => {
  const {
    kind,
    insertTopMargin,
    magicalAction,
    sortOrder,
    groupName,
    checkPenalty,
    improvementCost,
    addPoint,
    removePoint,
    remove,
  } = props

  const {
    dynamic: { value },
    static: { id, check, property, translations },
    isDecreasable,
    isIncreasable,
  } = magicalAction

  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)
  const canRemove = useAppSelector(selectCanRemove)
  const getProperty = useAppSelector(selectGetProperty)

  const { name = "" } = translateMap(translations) ?? {}

  const identifierObject = useMemo(() => createIdentifierObject(kind, id), [kind, id])

  const handleSelectForInfo = useCallback(
    () => dispatch(changeInlineLibraryEntry(identifierObject)),
    [dispatch, identifierObject],
  )

  const propertyName = useMemo(
    () => translateMap(getProperty(property.id.property)?.translations)?.name,
    [getProperty, property.id.property, translateMap],
  )

  const isActiveForInlineLibrary = useMemo(
    () => deepEqual(inlineLibraryEntryId, identifierObject),
    [identifierObject, inlineLibraryEntryId],
  )

  return (
    <ListItem insertTopMargin={insertTopMargin} active={isActiveForInlineLibrary}>
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup
        text={sortOrder === SpellsSortOrder.Group ? `${propertyName} / ${groupName}` : propertyName}
      />
      <ListItemValues>
        <SkillRating sr={value} addPoint={addPoint} />
        <SkillCheck check={check} checkPenalty={checkPenalty} />
        <SkillFill />
        <SkillImprovementCost ic={improvementCost} />
      </ListItemValues>
      <SkillButtons
        addDisabled={!isIncreasable}
        ic={improvementCost}
        id={id}
        removeDisabled={!isDecreasable}
        sr={value}
        addPoint={addPoint}
        removePoint={canRemove ? (value === 0 ? remove : removePoint) : undefined}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
}
