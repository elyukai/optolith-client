import { toKebabCase } from "@elyukai/utils/string"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedRangedCombatTechnique } from "../../../../../shared/domain/rated/combatTechnique.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { SkillAdditionalValues } from "../skills/SkillAdditionalValues.tsx"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"
import { SkillRating } from "../skills/SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  rangedCombatTechnique: DisplayedRangedCombatTechnique
}

/**
 * Displays a ranged combat technique.
 */
export const RangedCombatTechniquesListItem: FC<Props> = observer(props => {
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
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const { canRemove } = useCharacterState()
  const actions = useCharacterActions()

  const { name = "???" } = translateMap(translations) ?? {}

  const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary(
    "RangedCombatTechnique",
    id,
  )

  const primaryStr = primaryAttributeValues
    .map(({ dbEntry }) => translateMap(dbEntry.translations)?.abbreviation ?? "")
    .join("/")

  const customClassName = `attr--${primaryAttributeValues.map(({ dbEntry }) => toKebabCase(dbEntry.color.kind)).join("-")}`

  const primaryClassName = `primary ${customClassName}`

  return (
    <ListItem insertTopMargin={insertTopMargin} active={isActiveInInlineLibrary}>
      <ListItemName name={name} onClick={displayInlineLibraryEntry} />
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
        addPoint={() => actions.incrementRated("RangedCombatTechnique", id)}
        setToMax={() => actions.incrementRatedToMax("RangedCombatTechnique", id)}
        removePoint={
          canRemove ? () => actions.decrementRated("RangedCombatTechnique", id) : undefined
        }
        setToMin={
          canRemove ? () => actions.decrementRatedToMin("RangedCombatTechnique", id) : undefined
        }
        selectForInfo={displayInlineLibraryEntry}
      />
    </ListItem>
  )
})
