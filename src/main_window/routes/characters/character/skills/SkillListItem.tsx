import { observer } from "mobx-react-lite"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import type { DisplayedSkill } from "../../../../../shared/domain/rated/skill.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useInlineLibrary } from "../../../../hooks/inlineLibrary.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { selectSkillsCultureRatingVisibility } from "../../../../slices/settingsSlice.ts"
import { SkillButtons } from "./SkillButtons.tsx"
import { SkillCheck } from "./SkillCheck.tsx"
import { SkillImprovementCost } from "./SkillImprovementCost.tsx"
import { SkillRating } from "./SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  skill: DisplayedSkill
}

export const SkillListItem: React.FC<Props> = observer(props => {
  const {
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
  } = props

  const translateMap = useTranslateMap()
  const { canRemove } = useCharacterState()
  const actions = useCharacterActions()

  const cultureRatingVisibility = useAppSelector(selectSkillsCultureRatingVisibility)

  const { name = "???" } = translateMap(translations) ?? {}

  const { displayInlineLibraryEntry, isActiveInInlineLibrary } = useInlineLibrary("Skill", id)

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={isActiveInInlineLibrary}
      recommended={cultureRatingVisibility && commonness === "common"}
      unrecommended={cultureRatingVisibility && commonness === "uncommon"}
    >
      <ListItemName name={name} onClick={displayInlineLibraryEntry} />
      <ListItemSeparator />
      <ListItemGroup text={groupName} />
      <ListItemValues>
        <SkillRating sr={value} />
        <SkillCheck check={check} />
        <SkillImprovementCost ic={improvementCost} />
      </ListItemValues>
      <SkillButtons
        addDisabled={!isIncreasable}
        removeDisabled={!isDecreasable}
        addPoint={() => actions.incrementRated("Skill", id)}
        setToMax={() => actions.incrementRatedToMax("Skill", id)}
        removePoint={canRemove ? () => actions.decrementRated("Skill", id) : undefined}
        setToMin={canRemove ? () => actions.decrementRatedToMin("Skill", id) : undefined}
        selectForInfo={displayInlineLibraryEntry}
      />
    </ListItem>
  )
})
