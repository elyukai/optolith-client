import * as React from "react"
import { List } from "../../../Data/List"
import { INTERNAL_shallowEquals, Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { AttributeCombined } from "../../Models/View/AttributeCombined"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { CheckModifier } from "../../Models/Wiki/wikiTypeHelpers"
import { ListItem } from "../Universal/ListItem"
import { ListItemName } from "../Universal/ListItemName"
import { ListItemSeparator } from "../Universal/ListItemSeparator"
import { ListItemValues } from "../Universal/ListItemValues"
import { AdditionalValue, SkillAdditionalValues } from "./SkillAdditionalValues"
import { SkillButtons } from "./SkillButtons"
import { SkillCheck } from "./SkillCheck"
import { SkillFill } from "./SkillFill"
import { SkillGroup } from "./SkillGroup"
import { SkillImprovementCost } from "./SkillImprovementCost"
import { SkillRating } from "./SkillRating"

interface Props {
  attributes: List<Record<AttributeCombined>>
  activateDisabled?: boolean
  addDisabled?: boolean
  addFillElement?: boolean
  addValues?: List<AdditionalValue>
  addText?: string
  check?: List<string>
  checkDisabled?: boolean
  checkmod?: Maybe<CheckModifier>
  group?: number
  ic?: number
  id: string
  insertTopMargin?: boolean
  isNotActive?: boolean
  name: string
  noIncrease?: boolean
  removeDisabled?: boolean
  sr?: number
  typ?: boolean
  untyp?: boolean
  selectedForInfo: Maybe<string>
  staticData: StaticDataRecord
  isRemovingEnabled: boolean
  activate? (id: string): void
  addPoint? (id: string): void
  removePoint? (id: string): void
  getGroupName?: (id: number) => string
  selectForInfo (id: string): void
}

const SkillListItem: React.FC<Props> = props => {
  const {
    attributes,
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
    selectedForInfo,
    staticData,
    isRemovingEnabled,
    activate,
    addPoint,
    removePoint,
    selectForInfo,
  } = props

  const handleSelectForInfo =
    React.useCallback (
      () => selectForInfo (id),
      [ selectForInfo, id ]
    )

  return (
    <ListItem
      noIncrease={noIncrease}
      recommended={typ}
      unrecommended={untyp}
      insertTopMargin={insertTopMargin}
      active={Maybe.elem (id) (selectedForInfo)}
      >
      <ListItemName name={name} onClick={handleSelectForInfo} />
      <ListItemSeparator />
      <SkillGroup
        addText={addText}
        group={group}
        getGroupName={getGroupName}
        />
      <ListItemValues>
        <SkillRating
          isNotActive={isNotActive}
          noIncrease={noIncrease}
          sr={sr}
          addPoint={addPoint}
          />
        <SkillCheck
          attributes={attributes}
          check={check}
          checkDisabled={checkDisabled}
          checkmod={checkmod}
          staticData={staticData}
          />
        <SkillFill
          addFillElement={addFillElement}
          />
        <SkillImprovementCost
          ic={ic}
          />
        <SkillAdditionalValues
          addValues={addValues}
          />
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
        removePoint={isRemovingEnabled ? removePoint : undefined}
        selectForInfo={selectForInfo}
        />
    </ListItem>
  )
}

const MemoSkillListItem = React.memo (
  SkillListItem,
  (prevProps, nextProps) =>
    prevProps.sr === nextProps.sr
    && prevProps.addText === nextProps.addText
    && prevProps.activateDisabled === nextProps.activateDisabled
    && prevProps.addDisabled === nextProps.addDisabled
    && prevProps.removeDisabled === nextProps.removeDisabled
    && prevProps.attributes === nextProps.attributes
    && prevProps.staticData === nextProps.staticData
    && prevProps.insertTopMargin === nextProps.insertTopMargin
    && prevProps.typ === nextProps.typ
    && prevProps.untyp === nextProps.untyp
    && prevProps.isRemovingEnabled === nextProps.isRemovingEnabled
    && INTERNAL_shallowEquals (prevProps.selectedForInfo) (nextProps.selectedForInfo)
)

export { MemoSkillListItem as SkillListItem }
