import { memo, useCallback, useMemo } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { fromRaw } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import type { DisplayedSkill } from "../../../../../shared/domain/rated/skill.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { ExternalAPI } from "../../../../external.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { SelectGetById } from "../../../../selectors/basicCapabilitySelectors.ts"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import { selectSkillsCultureRatingVisibility } from "../../../../slices/settingsSlice.ts"
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
      id,
      skillCheckValues: check,
      group,
      improvement_cost,
      translations,
      value,
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

  const handleSelectForInfo = useCallback(
    () => dispatch(changeInlineLibraryEntry({ tag: "Skill", skill: id })),
    [dispatch, id],
  )

  const getStaticSkillGroupById = useAppSelector(SelectGetById.Static.SkillGroup)
  const groupName = useMemo(
    () => translateMap(getStaticSkillGroupById(group)?.translations)?.name,
    [getStaticSkillGroupById, group, translateMap],
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
        addPoint={() => ExternalAPI.execute("incrementSkill", id)}
        setToMax={() => ExternalAPI.execute("incrementSkillToMax", id)}
        removePoint={canRemove ? () => ExternalAPI.execute("decrementSkill", id) : undefined}
        setToMin={canRemove ? () => ExternalAPI.execute("decrementSkillToMin", id) : undefined}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
}

const MemoSkillListItem = memo(SkillListItem)

export { MemoSkillListItem as SkillListItem }
