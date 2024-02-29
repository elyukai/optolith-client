import { memo, useCallback, useMemo } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useRatedActions } from "../../../../hooks/ratedActions.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { SelectGetById } from "../../../../selectors/basicCapabilitySelectors.ts"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import { DisplayedSkill } from "../../../../selectors/skillsSelectors.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import { selectSkillsCultureRatingVisibility } from "../../../../slices/settingsSlice.ts"
import { decrementSkill, incrementSkill, setSkill } from "../../../../slices/skillsSlice.ts"
import { SkillButtons } from "./SkillButtons.tsx"
import { SkillCheck } from "./SkillCheck.tsx"
import { SkillImprovementCost } from "./SkillImprovementCost.tsx"
import { SkillRating } from "./SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  skill: DisplayedSkill
}

const SkillListItem: React.FC<Props> = props => {
  const {
    insertTopMargin,
    skill: {
      static: { id, check, group, improvement_cost, translations },
      dynamic: { value },
      maximum,
      minimum,
      isIncreasable,
      isDecreasable,
      commonness,
    },
  } = props

  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)
  const canRemove = useAppSelector(selectCanRemove)

  const cultureRatingVisibility = useAppSelector(selectSkillsCultureRatingVisibility)

  const { name = "???" } = translateMap(translations) ?? {}

  const { handleAddPoint, handleRemovePoint, handleSetToMaximumPoints, handleSetToMinimumPoints } =
    useRatedActions(
      id,
      value,
      maximum,
      minimum,
      fromRaw(improvement_cost),
      incrementSkill,
      decrementSkill,
      setSkill,
    )

  const handleSelectForInfo = useCallback(
    () => dispatch(changeInlineLibraryEntry({ tag: "Skill", skill: id })),
    [dispatch, id],
  )

  const getStaticSkillGroupById = useAppSelector(SelectGetById.Static.SkillGroup)
  const groupName = useMemo(
    () => translateMap(getStaticSkillGroupById(group.id.skill_group)?.translations)?.name,
    [getStaticSkillGroupById, group.id.skill_group, translateMap],
  )

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={inlineLibraryEntryId?.tag === "Skill" && inlineLibraryEntryId.skill === id}
      recommended={cultureRatingVisibility && commonness === "common"}
      unrecommended={cultureRatingVisibility && commonness === "uncommon"}
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup text={groupName} />
      <ListItemValues>
        <SkillRating sr={value} />
        <SkillCheck check={check} />
        <SkillImprovementCost ic={fromRaw(improvement_cost)} />
      </ListItemValues>
      <SkillButtons
        addDisabled={!isIncreasable}
        removeDisabled={!isDecreasable}
        addPoint={handleAddPoint}
        setToMax={handleSetToMaximumPoints}
        removePoint={canRemove ? handleRemovePoint : undefined}
        setToMin={canRemove ? handleSetToMinimumPoints : undefined}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
}

const MemoSkillListItem = memo(SkillListItem)

export { MemoSkillListItem as SkillListItem }
