import { toKebabCase } from "@elyukai/utils/string"
import { FC, memo, useCallback } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import type { DisplayedCloseCombatTechnique } from "../../../../../shared/domain/rated/combatTechnique.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { ExternalAPI } from "../../../../external.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
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
  canRemove: boolean
}

const CloseCombatTechniquesListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    closeCombatTechnique: {
      id,
      improvement_cost,
      translations,
      value,
      isIncreasable,
      isDecreasable,
      attackBase,
      parryBase,
      primaryAttributeValues,
    },
    canRemove,
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)

  const { name = "???" } = translateMap(translations) ?? {}

  const handleSelectForInfo = useCallback(
    () =>
      dispatch(
        changeInlineLibraryEntry({ tag: "CloseCombatTechnique", close_combat_technique: id }),
      ),
    [dispatch, id],
  )

  const primaryStr = primaryAttributeValues
    .map(({ dbEntry }) => translateMap(dbEntry.translations)?.abbreviation ?? "")
    .join("/")

  const customClassName = `attr--${primaryAttributeValues.map(({ dbEntry }) => toKebabCase(dbEntry.color.kind)).join("-")}`

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
        addPoint={() => ExternalAPI.execute("incrementRated", "CloseCombatTechnique", id)}
        setToMax={() => ExternalAPI.execute("incrementRatedToMax", "CloseCombatTechnique", id)}
        removePoint={
          canRemove
            ? () => ExternalAPI.execute("decrementRated", "CloseCombatTechnique", id)
            : undefined
        }
        setToMin={
          canRemove
            ? () => ExternalAPI.execute("decrementRatedToMin", "CloseCombatTechnique", id)
            : undefined
        }
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
