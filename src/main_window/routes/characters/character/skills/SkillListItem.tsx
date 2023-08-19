import {
  SkillCheckPenalty,
  SkillCheck as SkillCheckType,
} from "optolith-database-schema/types/_SkillCheck"
import { memo, useCallback } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { ImprovementCost } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import {
  changeInlineLibraryEntry,
  selectInlineLibraryEntryId,
} from "../../../../slices/inlineWikiSlice.ts"
import { AdditionalValue, SkillAdditionalValues } from "./SkillAdditionalValues.tsx"
import { SkillButtons } from "./SkillButtons.tsx"
import { SkillCheck } from "./SkillCheck.tsx"
import { SkillFill } from "./SkillFill.tsx"
import { SkillGroup } from "./SkillGroup.tsx"
import { SkillImprovementCost } from "./SkillImprovementCost.tsx"
import { SkillRating } from "./SkillRating.tsx"

type Props = {
  activateDisabled?: boolean
  addDisabled?: boolean
  addFillElement?: boolean
  addValues?: AdditionalValue[]
  addText?: string
  check?: SkillCheckType
  checkDisabled?: boolean
  checkmod?: SkillCheckPenalty
  group?: number
  ic?: ImprovementCost
  id: number
  insertTopMargin?: boolean
  isNotActive?: boolean
  name: string
  noIncrease?: boolean
  removeDisabled?: boolean
  sr?: number
  typ?: boolean
  untyp?: boolean
  activate?(id: number): void
  addPoint?(id: number): void
  removePoint?(id: number): void
  getGroupName?: (id: number) => string
}

const SkillListItem: React.FC<Props> = props => {
  const {
    activateDisabled,
    addDisabled,
    addFillElement,
    addValues,
    addText,
    check,
    checkDisabled,
    checkmod,
    getGroupName,
    group,
    ic,
    id,
    insertTopMargin,
    isNotActive,
    name,
    noIncrease,
    removeDisabled,
    sr,
    typ,
    untyp,
    activate,
    addPoint,
    removePoint,
  } = props

  const dispatch = useAppDispatch()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)
  const canRemove = useAppSelector(selectCanRemove)

  const handleSelectForInfo = useCallback(
    () => dispatch(changeInlineLibraryEntry({ tag: "Skill", skill: id })),
    [dispatch, id],
  )

  return (
    <ListItem
      noIncrease={noIncrease}
      recommended={typ}
      unrecommended={untyp}
      insertTopMargin={insertTopMargin}
      active={inlineLibraryEntryId?.tag === "Skill" && inlineLibraryEntryId.skill === id}
    >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <SkillGroup addText={addText} group={group} getGroupName={getGroupName} />
      <ListItemValues>
        <SkillRating
          isNotActive={isNotActive}
          noIncrease={noIncrease}
          sr={sr}
          addPoint={addPoint}
        />
        {checkDisabled !== true && check !== undefined ? (
          <SkillCheck check={check} checkPenalty={checkmod} />
        ) : null}
        <SkillFill addFillElement={addFillElement} />
        <SkillImprovementCost ic={ic} />
        <SkillAdditionalValues addValues={addValues} />
      </ListItemValues>
      <SkillButtons
        activateDisabled={activateDisabled}
        addDisabled={addDisabled}
        ic={ic}
        id={id}
        isNotActive={isNotActive}
        removeDisabled={removeDisabled}
        sr={sr}
        activate={activate}
        addPoint={addPoint}
        removePoint={canRemove ? removePoint : undefined}
        selectForInfo={handleSelectForInfo}
      />
    </ListItem>
  )
}

const MemoSkillListItem = memo(SkillListItem)

export { MemoSkillListItem as SkillListItem }
