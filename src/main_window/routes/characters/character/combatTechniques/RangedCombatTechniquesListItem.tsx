// import * as React from "react"
// import { equals } from "../../../Data/Eq"
// import { fmapF } from "../../../Data/Functor"
// import { find, flength, intercalate, List } from "../../../Data/List"
// import { fromMaybe, listToMaybe, mapMaybe, Maybe, maybe } from "../../../Data/Maybe"
// import { lookupF } from "../../../Data/OrderedMap"
// import { Record } from "../../../Data/Record"
// import { NumIdName } from "../../Models/NumIdName"
// import { AttributeCombined, AttributeCombinedA_ } from "../../Models/View/AttributeCombined"
// import { CombatTechniqueWithRequirements, CombatTechniqueWithRequirementsA_ } from "../../Models/View/CombatTechniqueWithRequirements"
// import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
// import { ndash } from "../../Utilities/Chars"
// import { pipe, pipe_ } from "../../Utilities/pipe"
// import { SkillListItem } from "../Skills/SkillListItem"

import { AttributeReference } from "optolith-database-schema/types/_SimpleReferences"
import { FC, memo, useCallback } from "react"
import { ListItem } from "../../../../../shared/components/list/ListItem.tsx"
import { ListItemGroup } from "../../../../../shared/components/list/ListItemGroup.tsx"
import { ListItemName } from "../../../../../shared/components/list/ListItemName.tsx"
import { ListItemSeparator } from "../../../../../shared/components/list/ListItemSeparator.tsx"
import { ListItemValues } from "../../../../../shared/components/list/ListItemValues.tsx"
import { ImprovementCost } from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import { selectAttributes } from "../../../../slices/databaseSlice.ts"
import { changeInlineLibraryEntry, selectInlineLibraryEntryId } from "../../../../slices/inlineWikiSlice.ts"
import { SkillAdditionalValues } from "../skills/SkillAdditionalValues.tsx"
import { SkillButtons } from "../skills/SkillButtons.tsx"
import { SkillImprovementCost } from "../skills/SkillImprovementCost.tsx"
import { SkillRating } from "../skills/SkillRating.tsx"

type Props = {
  insertTopMargin?: boolean
  id: number
  name: string
  sr: number
  primary: AttributeReference[]
  ic: ImprovementCost
  addDisabled: boolean
  removeDisabled: boolean
  at: number
  addPoint: (id: number) => void
  removePoint: (id: number) => void
}

const RangedCombatTechniquesListItem: FC<Props> = props => {
  const {
    insertTopMargin,
    id,
    name,
    sr,
    primary,
    ic,
    addDisabled,
    removeDisabled,
    at,
    addPoint,
    removePoint,
  } = props

  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const inlineLibraryEntryId = useAppSelector(selectInlineLibraryEntryId)
  const canRemove = useAppSelector(selectCanRemove)

  const handleSelectForInfo =
    useCallback(
      () => dispatch(changeInlineLibraryEntry({ tag: "RangedCombatTechnique", ranged_combat_technique: id })),
      [ dispatch, id ]
    )

  const attributes = useAppSelector(selectAttributes)

  const primaryStr = primary
    .map(ref => translateMap(attributes[ref.id.attribute]?.translations)?.abbreviation ?? "")
    .join("/")

  const customClassName = `attr--${primary.map(ref => ref.id.attribute).join("-")}`

  const primaryClassName = `primary ${customClassName}`

  return (
    <ListItem
      insertTopMargin={insertTopMargin}
      active={inlineLibraryEntryId?.tag === "RangedCombatTechnique" && inlineLibraryEntryId.ranged_combat_technique === id}
      >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <ListItemGroup text={translate("Ranged Combat")} />
      <ListItemValues>
        <SkillRating
          sr={sr}
          addPoint={addPoint}
          />
        <SkillImprovementCost ic={ic} />
        <SkillAdditionalValues
          addValues={[
            { className: primaryClassName, value: primaryStr },
            { className: "at", value: at },
            { className: "atpa" },
            {
              className: "pa",
              value: "—",
            }
          ]}
          />
      </ListItemValues>
      <SkillButtons
        addDisabled={addDisabled}
        ic={ic}
        id={id}
        removeDisabled={removeDisabled}
        sr={sr}
        addPoint={addPoint}
        removePoint={canRemove ? removePoint : undefined}
        selectForInfo={handleSelectForInfo}
        />
    </ListItem>
  )
}

const MemoRangedCombatTechniquesListItem = memo(RangedCombatTechniquesListItem)

export { MemoRangedCombatTechniquesListItem as RangedCombatTechniquesListItem }
