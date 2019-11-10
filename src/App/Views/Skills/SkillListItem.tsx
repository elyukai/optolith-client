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

export interface SkillListItemProps {
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
  activate? (): void
  addPoint? (id: string): void
  removePoint? (id: string): void
  selectForInfo (id: string): void
}

export class SkillListItem extends React.Component<SkillListItemProps> {
  shouldComponentUpdate (nextProps: SkillListItemProps) {
    return this.props.sr !== nextProps.sr
      || this.props.addText !== nextProps.addText
      || this.props.activateDisabled !== nextProps.activateDisabled
      || this.props.addDisabled !== nextProps.addDisabled
      || this.props.removeDisabled !== nextProps.removeDisabled
      || this.props.attributes !== nextProps.attributes
      || this.props.l10n !== nextProps.l10n
      || this.props.insertTopMargin !== nextProps.insertTopMargin
      || this.props.typ !== nextProps.typ
      || this.props.untyp !== nextProps.untyp
      || !INTERNAL_shallowEquals (this.props.selectedForInfo) (nextProps.selectedForInfo)
  }

  render () {
    const {
      insertTopMargin,
      name,
      noIncrease,
      typ,
      untyp,
      id,
      selectedForInfo,
    } = this.props

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
        <SkillGroup {...this.props} />
        <ListItemValues>
          <SkillRating {...this.props} />
          <SkillCheck {...this.props} />
          <SkillFill {...this.props} />
          <SkillImprovementCost {...this.props} />
          <SkillAdditionalValues {...this.props} />
        </ListItemValues>
        <SkillButtons {...this.props}  />
      </ListItem>
    )
  }
}
