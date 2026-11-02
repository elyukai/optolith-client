import { observer } from "mobx-react-lite"
import { useCallback } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedAttribute } from "../../../../../shared/domain/rated/attribute.ts"
import type { DisplayedSkill } from "../../../../../shared/domain/rated/skill.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import {
  InlineLibraryManager,
  type DisplayableMainIdentifier,
} from "../../../../inlineLibrary/InlineLibrary.tsx"
import { selectSkillsCultureRatingVisibility } from "../../../../slices/settingsSlice.ts"
import { SkillButtons } from "./SkillButtons.tsx"
import { SkillCheck } from "./SkillCheck.tsx"
import { SkillImprovementCost } from "./SkillImprovementCost.tsx"
import { SkillRating } from "./SkillRating.tsx"

type Props = {
  canRemove: boolean
  insertTopMargin?: boolean
  skill: DisplayedSkill
  attributes: DisplayedAttribute[]
  selectedInlineLibraryEntryId?: DisplayableMainIdentifier
}

export const SkillListItem: React.FC<Props> = observer(props => {
  const {
    canRemove,
    insertTopMargin,
    skill: {
      id,
      check,
      groupName,
      improvementCost,
      translations,
      value,
      isIncreasable,
      isDecreasable,
      commonness,
    },
    attributes,
    selectedInlineLibraryEntryId,
  } = props

  const translateMap = useTranslateMap()
  const actions = useCharacterActions()

  const cultureRatingVisibility = useAppSelector(selectSkillsCultureRatingVisibility)

  const { name = "???" } = translateMap(translations) ?? {}

  const handleSelectForInfo = useCallback(
    () => InlineLibraryManager.instance.goTo(["Skill", id]),
    [id],
  )

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={
        selectedInlineLibraryEntryId?.[0] === "Skill" && selectedInlineLibraryEntryId[1] === id
      }
      recommended={cultureRatingVisibility && commonness === "common"}
      unrecommended={cultureRatingVisibility && commonness === "uncommon"}
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup text={groupName} />
      <ListItemValues>
        <SkillRating sr={value} />
        <SkillCheck check={check} attributes={attributes} />
        <SkillImprovementCost ic={improvementCost} />
      </ListItemValues>
      <SkillButtons
        addDisabled={!isIncreasable}
        removeDisabled={!isDecreasable}
        addPoint={() => actions.incrementRated("Skill", id)}
        setToMax={() => actions.incrementRatedToMax("Skill", id)}
        removePoint={canRemove ? () => actions.decrementRated("Skill", id) : undefined}
        setToMin={canRemove ? () => actions.decrementRatedToMin("Skill", id) : undefined}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
})
