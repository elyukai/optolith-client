import { toKebabCase } from "@elyukai/utils/string"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedCloseCombatTechnique } from "../../../../../shared/domain/rated/combatTechnique.ts"
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
  closeCombatTechnique: DisplayedCloseCombatTechnique
}

/**
 * Displays a close combat technique.
 */
export const CloseCombatTechniquesListItem: FC<Props> = observer(props => {
  const {
    insertTopMargin,
    closeCombatTechnique: {
      id,
      improvementCost,
      translations,
      value,
      isIncreasable,
      isDecreasable,
      attackBase,
      parryBase,
      primaryAttributeValues,
    },
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const { canRemove } = useCharacterState()
  const actions = useCharacterActions()

  const { name = "???" } = translateMap(translations) ?? {}

  const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary(
    "CloseCombatTechnique",
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
      <ListItemGroup text={translate("Close Combat")} />
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
              value: parryBase ?? "—",
            },
          ]}
        />
      </ListItemValues>
      <SkillButtons
        addDisabled={!isIncreasable}
        removeDisabled={!isDecreasable}
        addPoint={() => actions.incrementRated("CloseCombatTechnique", id)}
        setToMax={() => actions.incrementRatedToMax("CloseCombatTechnique", id)}
        removePoint={
          canRemove ? () => actions.decrementRated("CloseCombatTechnique", id) : undefined
        }
        setToMin={
          canRemove ? () => actions.decrementRatedToMin("CloseCombatTechnique", id) : undefined
        }
        selectForInfo={displayInlineLibraryEntry}
      />
    </ListItem>
  )
})
