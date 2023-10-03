import { FC, memo, useCallback, useMemo } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { getAspectsForTranslation } from "../../../../../shared/domain/liturgicalChant.ts"
import { DisplayedInactiveCeremony } from "../../../../../shared/domain/liturgicalChantInactive.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectActiveBlessedTradition } from "../../../../selectors/traditionSelectors.ts"
import { selectAspects } from "../../../../slices/databaseSlice.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import { LiturgiesSortOrder } from "../../../../slices/settingsSlice.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillCheck } from "../skills/SkillCheck.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"

type Props = {
  insertTopMargin?: boolean
  ceremony: DisplayedInactiveCeremony
  sortOrder: LiturgiesSortOrder
  add: (id: number) => void
}

const InactiveCeremoniesListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    ceremony: {
      static: { id, check, check_penalty, traditions, improvement_cost, translations },
      isAvailable,
    },
    sortOrder,
    add,
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)
  const activeBlessedTradition = useAppSelector(selectActiveBlessedTradition)
  const staticAspects = useAppSelector(selectAspects)

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
      disabled={!isAvailable}
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
 * Displays a ceremony that is currently inactive.
 */
const MemoInactiveCeremoniesListItem = memo(InactiveCeremoniesListItem)

export { MemoInactiveCeremoniesListItem as InactiveCeremoniesListItem }
