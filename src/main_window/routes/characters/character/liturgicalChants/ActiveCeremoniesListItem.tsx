import { FC, memo, useCallback, useMemo } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { getAspectsForTranslation } from "../../../../../shared/domain/rated/liturgicalChant.ts"
import { DisplayedActiveCeremony } from "../../../../../shared/domain/rated/liturgicalChantActive.ts"
import { LiturgiesSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import { selectActiveBlessedTradition } from "../../../../selectors/traditionSelectors.ts"
import { selectStaticAspects } from "../../../../slices/databaseSlice.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillCheck } from "../skills/SkillCheck.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"
import { SkillRating } from "../skills/SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  ceremony: DisplayedActiveCeremony
  sortOrder: LiturgiesSortOrder
  addPoint: (id: number) => void
  removePoint: (id: number) => void
  remove: (id: number) => void
}

const ActiveCeremoniesListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    ceremony: {
      dynamic: { value },
      static: { id, check, check_penalty, traditions, improvement_cost, translations },
      isDecreasable,
      isIncreasable,
    },
    sortOrder,
    addPoint,
    removePoint,
    remove,
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)
  const canRemove = useAppSelector(selectCanRemove)
  const activeBlessedTradition = useAppSelector(selectActiveBlessedTradition)
  const staticAspects = useAppSelector(selectStaticAspects)

  const { name = "" } = translateMap(translations) ?? {}

  const handleSelectForInfo = useCallback(
    () => dispatch(changeInlineLibraryEntry({ tag: "Ceremony", ceremony: id })),
    [dispatch, id],
  )

  const aspects = useMemo(
    () =>
      activeBlessedTradition === undefined
        ? ""
        : getAspectsForTranslation(
            traditions,
            activeBlessedTradition.static,
            aspectId => staticAspects[aspectId],
            translateMap,
          )
            .sort(localeCompare)
            .join(", "),
    [activeBlessedTradition, localeCompare, staticAspects, traditions, translateMap],
  )

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={inlineLibraryEntryId?.tag === "Ceremony" && inlineLibraryEntryId.ceremony === id}
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup
        text={
          sortOrder === LiturgiesSortOrder.Group
            ? `${aspects} / ${translate("Ceremonies")}`
            : aspects
        }
      />
      <ListItemValues>
        <SkillRating sr={value} addPoint={addPoint} />
        <SkillCheck check={check} checkPenalty={check_penalty} />
        <SkillFill />
        <SkillImprovementCost ic={fromRaw(improvement_cost)} />
      </ListItemValues>
      <SkillButtons
        addDisabled={!isIncreasable}
        ic={fromRaw(improvement_cost)}
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

/**
 * Displays a ceremony that is currently active.
 */
const MemoActiveCeremoniesListItem = memo(ActiveCeremoniesListItem)

export { MemoActiveCeremoniesListItem as ActiveCeremoniesListItem }
