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
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { SkillAdditionalValues } from "../skills/SkillAdditionalValues.tsx"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"
import { SkillRating } from "../skills/SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  entry: DisplayedRangedCombatTechnique
}

/**
 * Displays a ranged combat technique.
 */
export const RangedCombatTechniquesListItem: FC<Props> = observer(
  function RangedCombatTechniquesListItem(props) {
    const { insertTopMargin, entry } = props
    const { id, primaryAttributeValues, name, attackBase } = entry

    const translate = useTranslate()
    const translateMap = useTranslateMap()

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
          <SkillRating entry={entry} />
          <SkillImprovementCost entry={entry} />
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
          entityName="RangedCombatTechnique"
          entry={entry}
          selectForInfo={displayInlineLibraryEntry}
        />
      </ListItem>
    )
  },
)
