import { toKebabCase } from "@elyukai/utils/string"
import { memo, useCallback, type FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedRangedCombatTechnique } from "../../../../../shared/domain/rated/combatTechnique.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { SharedActions } from "../../../../external.ts"
import {
  InlineLibraryManager,
  type DisplayableMainIdentifier,
} from "../../../../inlineLibrary/InlineLibrary.tsx"
import { SkillAdditionalValues } from "../skills/SkillAdditionalValues.tsx"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"
import { SkillRating } from "../skills/SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  rangedCombatTechnique: DisplayedRangedCombatTechnique
  canRemove: boolean
  selectedInlineLibraryEntryId?: DisplayableMainIdentifier
}

const RangedCombatTechniquesListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    rangedCombatTechnique: {
      id,
      primaryAttributeValues,
      improvementCost,
      translations,
      value,
      isIncreasable,
      isDecreasable,
      attackBase,
    },
    canRemove,
    selectedInlineLibraryEntryId,
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()

  const { name = "???" } = translateMap(translations) ?? {}

  const handleSelectForInfo = useCallback(
    () => InlineLibraryManager.instance.goTo(["RangedCombatTechnique", id]),
    [id],
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
        selectedInlineLibraryEntryId?.[0] === "RangedCombatTechnique" &&
        selectedInlineLibraryEntryId[1] === id
      }
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup text={translate("Ranged Combat")} />
      <ListItemValues>
        <SkillRating sr={value} />
        <SkillImprovementCost ic={improvementCost} />
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
        addPoint={() => SharedActions.incrementRated("RangedCombatTechnique", id)}
        setToMax={() => SharedActions.incrementRatedToMax("RangedCombatTechnique", id)}
        removePoint={
          canRemove ? () => SharedActions.decrementRated("RangedCombatTechnique", id) : undefined
        }
        setToMin={
          canRemove
            ? () => SharedActions.decrementRatedToMin("RangedCombatTechnique", id)
            : undefined
        }
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
