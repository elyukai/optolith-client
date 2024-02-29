import { SkillCheckPenalty } from "optolith-database-schema/types/_SkillCheck"
import { ReactNode, useCallback, useMemo } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { ImprovementCost } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { createIdentifierObject } from "../../../../../shared/domain/identifier.ts"
import { DisplayedInactiveMagicalAction } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { deepEqual } from "../../../../../shared/utils/compare.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { SelectGetById } from "../../../../selectors/basicCapabilitySelectors.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillCheck } from "../skills/SkillCheck.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"

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

type Props<T extends DisplayedInactiveMagicalAction> = {
  kind: Kind
  insertTopMargin?: boolean
  magicalAction: T
  sortOrder: SpellsSortOrder
  groupName: string
  checkPenalty?: SkillCheckPenalty
  improvementCost?: ImprovementCost
  add: () => void
}

/**
 * Displays a spell that is currently inactive.
 */
export const InactiveMagicalActionsListItem = <T extends DisplayedInactiveMagicalAction>(
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
    add,
  } = props

  const {
    static: { id, check, property, translations },
    isAvailable,
  } = magicalAction

  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)
  const getProperty = useAppSelector(SelectGetById.Static.Property)

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
        <SkillCheck check={check} checkPenalty={checkPenalty} />
        <SkillFill />
        <SkillImprovementCost ic={improvementCost} />
      </ListItemValues>
      <SkillButtons addDisabled={!isAvailable} addPoint={add} selectForInfo={handleSelectForInfo} />
    </ListItem>
  )
}
