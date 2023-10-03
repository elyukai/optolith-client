import { FC, memo, useCallback } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { AspectIdentifier } from "../../../../../shared/domain/identifier.ts"
import { DisplayedActiveBlessing } from "../../../../../shared/domain/liturgicalChantActive.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import { selectAspects } from "../../../../slices/databaseSlice.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import { LiturgiesSortOrder } from "../../../../slices/settingsSlice.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"

type Props = {
  insertTopMargin?: boolean
  blessing: DisplayedActiveBlessing
  sortOrder: LiturgiesSortOrder
  remove: (id: number) => void
}

const ActiveBlessingsListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    blessing: {
      static: { id, translations },
    },
    sortOrder,
    remove,
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)
  const canRemove = useAppSelector(selectCanRemove)
  const staticAspects = useAppSelector(selectAspects)

  const { name = "" } = translateMap(translations) ?? {}

  const handleSelectForInfo = useCallback(
    () => dispatch(changeInlineLibraryEntry({ tag: "Blessing", blessing: id })),
    [dispatch, id],
  )

  const aspects = translateMap(staticAspects[AspectIdentifier.General]?.translations)?.name ?? ""

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={inlineLibraryEntryId?.tag === "Blessing" && inlineLibraryEntryId.blessing === id}
      noIncrease
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup
        text={
          sortOrder === LiturgiesSortOrder.Group
            ? `${aspects} / ${translate("Blessings")}`
            : aspects
        }
      />
      <ListItemValues>
        <SkillFill />
      </ListItemValues>
      <SkillButtons
        id={id}
        removePoint={canRemove ? remove : undefined}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
}

const MemoActiveBlessingsListItem = memo(ActiveBlessingsListItem)

/**
 *
 */
export { MemoActiveBlessingsListItem as ActiveBlessingsListItem }
