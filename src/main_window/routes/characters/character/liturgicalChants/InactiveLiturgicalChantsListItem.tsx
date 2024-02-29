import { FC, memo, useCallback, useMemo } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { getAspectsForTranslation } from "../../../../../shared/domain/rated/liturgicalChant.ts"
import { DisplayedInactiveLiturgicalChant } from "../../../../../shared/domain/rated/liturgicalChantInactive.ts"
import { LiturgiesSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useInactiveActivatableActions } from "../../../../hooks/ratedActions.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectActiveBlessedTradition } from "../../../../selectors/traditionSelectors.ts"
import { selectStaticAspects } from "../../../../slices/databaseSlice.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import { addLiturgicalChant } from "../../../../slices/liturgicalChantsSlice.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillCheck } from "../skills/SkillCheck.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"

type Props = {
  insertTopMargin?: boolean
  liturgicalChant: DisplayedInactiveLiturgicalChant
  sortOrder: LiturgiesSortOrder
}

const InactiveLiturgicalChantsListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    liturgicalChant: {
      static: { id, check, check_penalty, traditions, improvement_cost, translations },
      isAvailable,
    },
    sortOrder,
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)
  const activeBlessedTradition = useAppSelector(selectActiveBlessedTradition)
  const staticAspects = useAppSelector(selectStaticAspects)

  const { name = "" } = translateMap(translations) ?? {}

  const { handleAdd } = useInactiveActivatableActions(
    id,
    fromRaw(improvement_cost),
    addLiturgicalChant,
  )

  const handleSelectForInfo = useCallback(
    () => dispatch(changeInlineLibraryEntry({ tag: "LiturgicalChant", liturgical_chant: id })),
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
      active={
        inlineLibraryEntryId?.tag === "LiturgicalChant" &&
        inlineLibraryEntryId.liturgical_chant === id
      }
      disabled={!isAvailable}
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup
        text={
          sortOrder === LiturgiesSortOrder.Group
            ? `${aspects} / ${translate("Liturgical Chants")}`
            : aspects
        }
      />
      <ListItemValues>
        <SkillCheck check={check} checkPenalty={check_penalty} />
        <SkillFill />
        <SkillImprovementCost ic={fromRaw(improvement_cost)} />
      </ListItemValues>
      <SkillButtons
        addDisabled={!isAvailable}
        addPoint={handleAdd}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
}

const MemoInactiveLiturgicalChantsListItem = memo(InactiveLiturgicalChantsListItem)

/**
 * Displays a liturgical chant that is currently inactive.
 */
export { MemoInactiveLiturgicalChantsListItem as InactiveLiturgicalChantsListItem }
