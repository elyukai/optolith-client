import * as React from "react";
import { List } from "../../../Data/List";
import { INTERNAL_shallowEquals, Maybe } from "../../../Data/Maybe";
import { OrderedSet } from "../../../Data/OrderedSet";
import { Record } from "../../../Data/Record";
import { AttributeCombined } from "../../Models/View/AttributeCombined";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { CheckModifier } from "../../Models/Wiki/wikiTypeHelpers";
import { ListItem } from "../Universal/ListItem";
import { ListItemName } from "../Universal/ListItemName";
import { ListItemSeparator } from "../Universal/ListItemSeparator";
import { ListItemValues } from "../Universal/ListItemValues";
import { AdditionalValue, SkillAdditionalValues } from "./SkillAdditionalValues";
import { SkillButtons } from "./SkillButtons";
import { SkillCheck } from "./SkillCheck";
import { SkillFill } from "./SkillFill";
import { SkillGroup } from "./SkillGroup";
import { SkillImprovementCost } from "./SkillImprovementCost";
import { SkillRating } from "./SkillRating";

interface Props {
  attributes: List<Record<AttributeCombined>>
  activateDisabled?: boolean
  addDisabled?: boolean
  addFillElement?: boolean
  addValues?: List<AdditionalValue>
  addText?: string
  check?: List<string>
  checkDisabled?: boolean
  checkmod?: OrderedSet<CheckModifier>
  groupList?: List<string>
  groupIndex?: number
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
  l10n: L10nRecord
  activate? (id: string): void
  addPoint? (id: string): void
  removePoint? (id: string): void
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
    groupList,
    groupIndex,
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
    l10n,
    activate,
    addPoint,
    removePoint,
    selectForInfo,
  } = props

  return (
    <ListItem
      noIncrease={noIncrease}
      recommended={typ}
      unrecommended={untyp}
      insertTopMargin={insertTopMargin}
      active={Maybe.elem (id) (selectedForInfo)}
      >
      <ListItemName name={name} />
      <ListItemSeparator />
      <SkillGroup
        addText={addText}
        groupList={groupList}
        groupIndex={groupIndex}
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
          l10n={l10n}
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
        removePoint={removePoint}
        selectForInfo={selectForInfo}
        />
    </ListItem>
  )
}

const MemoSkillListItem = React.memo (
  SkillListItem,
  (prevProps, nextProps) =>
    prevProps.sr !== nextProps.sr
    || prevProps.addText !== nextProps.addText
    || prevProps.activateDisabled !== nextProps.activateDisabled
    || prevProps.addDisabled !== nextProps.addDisabled
    || prevProps.removeDisabled !== nextProps.removeDisabled
    || prevProps.attributes !== nextProps.attributes
    || prevProps.l10n !== nextProps.l10n
    || prevProps.insertTopMargin !== nextProps.insertTopMargin
    || prevProps.typ !== nextProps.typ
    || prevProps.untyp !== nextProps.untyp
    || !INTERNAL_shallowEquals (prevProps.selectedForInfo) (nextProps.selectedForInfo)
)

export { MemoSkillListItem as SkillListItem };
