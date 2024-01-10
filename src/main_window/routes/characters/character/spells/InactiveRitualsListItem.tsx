import { FC, memo, useCallback, useMemo } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { DisplayedInactiveRitual } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
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

type Props = {
  insertTopMargin?: boolean
  ritual: DisplayedInactiveRitual
  sortOrder: SpellsSortOrder
  add: (id: number) => void
}

const InactiveRitualsListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    ritual: {
      static: { id, check, check_penalty, property, improvement_cost, translations },
      isAvailable,
      isUnfamiliar,
    },
    sortOrder,
    add,
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)
  const getProperty = useAppSelector(SelectGetById.Static.Property)

  const { name = "" } = translateMap(translations) ?? {}

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
        <SkillCheck check={check} checkPenalty={check_penalty} />
        <SkillFill />
        <SkillImprovementCost ic={fromRaw(improvement_cost)} />
      </ListItemValues>
      <SkillButtons
        addDisabled={!isAvailable}
        ic={fromRaw(improvement_cost)}
        id={id}
        addPoint={add}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
}

/**
 * Displays a ritual that is currently inactive.
 */
const MemoInactiveRitualsListItem = memo(InactiveRitualsListItem)

export { MemoInactiveRitualsListItem as InactiveRitualsListItem }
