import { useCallback, type FC } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedInactiveLiturgicalChant } from "../../../../../shared/domain/rated/liturgicalChant.ts"
import type { DisplayedInactiveSpellwork } from "../../../../../shared/domain/rated/spell.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillCheck } from "../skills/SkillCheck.tsx"
import { SkillFill } from "../skills/SkillFill.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"

type Props = {
  insertTopMargin?: boolean
  entry: DisplayedInactiveSpellwork | DisplayedInactiveLiturgicalChant
  displayGroup?: boolean
}

export const InactiveActivatableRatedListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    entry: {
      type,
      id,
      check,
      checkPenalty,
      improvementCost,
      name,
      groupName,
      associatedText,
      isAvailable,
    },
    displayGroup,
  } = props

  const actions = useCharacterActions()

  const handleAdd = useCallback(() => actions.activateRated(type, id), [id])

  const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary(type, id)

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={isActiveInInlineLibrary}
      disabled={!isAvailable}
    >
      <ListItemName name={name} onClick={displayInlineLibraryEntry} />
      <ListItemSeparator />
      <ListItemGroup text={displayGroup ? `${associatedText} / ${groupName}` : associatedText} />
      <ListItemValues>
        <SkillCheck check={check} checkPenalty={checkPenalty} />
        <SkillFill />
        <SkillImprovementCost ic={improvementCost} />
      </ListItemValues>
      <SkillButtons
        addDisabled={!isAvailable}
        addPoint={handleAdd}
        selectForInfo={displayInlineLibraryEntry}
      />
    </ListItem>
  )
}
